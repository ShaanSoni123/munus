// Google API TypeScript declarations
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenResponse {
        access_token: string;
        token_type: string;
        expires_in: number;
        scope: string;
        error?: string;
      }

      interface TokenClient {
        requestAccessToken(): void;
        callback: (response: TokenResponse) => void;
      }

      function initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }): TokenClient;
    }
  }

  namespace picker {
    enum Action {
      PICKED = 'picked',
      CANCEL = 'cancel'
    }

    enum ViewId {
      DOCS = 'docs',
      DOCS_UPLOAD = 'docs_upload'
    }

    enum Feature {
      NAV_HIDDEN = 'nav_hidden',
      MULTISELECT_ENABLED = 'multiselect_enabled'
    }

    interface PickerBuilder {
      addView(view: DocsView | DocsUploadView): PickerBuilder;
      setOAuthToken(token: string): PickerBuilder;
      setDeveloperKey(key: string): PickerBuilder;
      setCallback(callback: (data: PickerCallbackData) => void): PickerBuilder;
      setTitle(title: string): PickerBuilder;
      setSelectableMimeTypes(mimeTypes: string): PickerBuilder;
      enableFeature(feature: Feature, enabled?: boolean): PickerBuilder;
      build(): Picker;
    }

    interface Picker {
      setVisible(visible: boolean): void;
    }

    interface DocsView {
      setIncludeFolders(include: boolean): DocsView;
      setSelectFolderEnabled(enabled: boolean): DocsView;
    }

    interface DocsUploadView {
      setIncludeFolders(include: boolean): DocsUploadView;
    }

    interface PickerCallbackData {
      action: Action;
      docs: PickerDocument[];
    }

    interface PickerDocument {
      id: string;
      name: string;
      mimeType: string;
      sizeBytes?: string;
      url?: string;
    }

    function PickerBuilder(): PickerBuilder;
    function DocsView(): DocsView;
    function DocsUploadView(): DocsUploadView;
  }
}

declare namespace gapi {
  function load(api: string, callback: () => void): void;
  
  namespace client {
    function init(config: {
      apiKey: string;
      discoveryDocs: string[];
    }): Promise<void>;
  }
}

export {}; 