// Google Drive API service for resume imports
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  downloadUrl?: string;
}

export interface GoogleDriveServiceConfig {
  clientId: string;
  apiKey: string;
  scope: string;
  discoveryDocs: string[];
}

class GoogleDriveService {
  private config: GoogleDriveServiceConfig;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private pickerApiLoaded = false;
  private oauthToken: string | null = null;

  constructor(config: GoogleDriveServiceConfig) {
    this.config = config;
  }

  // Initialize Google APIs
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Google API client
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client:picker', async () => {
          try {
            await gapi.client.init({
              apiKey: this.config.apiKey,
              discoveryDocs: this.config.discoveryDocs,
            });
            
            // Load OAuth2 client
            await this.loadOAuth2Client();
            this.pickerApiLoaded = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  private async loadOAuth2Client(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.config.clientId,
          scope: this.config.scope,
          callback: (tokenResponse) => {
            this.oauthToken = tokenResponse.access_token;
          },
        });
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load OAuth2 client'));
      document.head.appendChild(script);
    });
  }

  // Request OAuth token
  async requestToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('OAuth2 client not initialized'));
        return;
      }

      this.tokenClient.callback = (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error));
        } else {
          this.oauthToken = tokenResponse.access_token;
          resolve(tokenResponse.access_token);
        }
      };

      this.tokenClient.requestAccessToken();
    });
  }

  // Open Google Picker
  async openPicker(): Promise<GoogleDriveFile | null> {
    if (!this.pickerApiLoaded) {
      throw new Error('Google Picker API not loaded');
    }

    if (!this.oauthToken) {
      await this.requestToken();
    }

    return new Promise((resolve, reject) => {
      const picker = new google.picker.PickerBuilder()
        .addView(
          new google.picker.DocsView()
            .setIncludeFolders(true)
            .setSelectFolderEnabled(false)
        )
        .addView(
          new google.picker.DocsUploadView()
            .setIncludeFolders(true)
        )
        .setOAuthToken(this.oauthToken!)
        .setDeveloperKey(this.config.apiKey)
        .setCallback((data) => {
          if (data.action === google.picker.Action.PICKED) {
            const doc = data.docs[0];
            const file: GoogleDriveFile = {
              id: doc.id,
              name: doc.name,
              mimeType: doc.mimeType,
              size: doc.sizeBytes,
              webViewLink: doc.url,
            };
            resolve(file);
          } else if (data.action === google.picker.Action.CANCEL) {
            resolve(null);
          }
        })
        .setTitle('Select your resume')
        .setSelectableMimeTypes('application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED, false)
        .build();

      picker.setVisible(true);
    });
  }

  // Download file content
  async downloadFile(fileId: string): Promise<ArrayBuffer> {
    if (!this.oauthToken) {
      throw new Error('No OAuth token available');
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${this.oauthToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  // Get file metadata
  async getFileMetadata(fileId: string): Promise<GoogleDriveFile> {
    if (!this.oauthToken) {
      throw new Error('No OAuth token available');
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,webViewLink`,
      {
        headers: {
          Authorization: `Bearer ${this.oauthToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get file metadata: ${response.statusText}`);
    }

    return response.json();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.oauthToken;
  }

  // Clear authentication
  clearAuth(): void {
    this.oauthToken = null;
  }
}

// Create singleton instance
const googleDriveService = new GoogleDriveService({
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
});

export default googleDriveService; 