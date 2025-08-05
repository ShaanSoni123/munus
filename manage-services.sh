#!/bin/bash

# SkillGlide Service Management Script

case "$1" in
    start)
        echo "Starting SkillGlide services..."
        launchctl load ~/Library/LaunchAgents/com.skillglide.backend.plist
        launchctl load ~/Library/LaunchAgents/com.skillglide.frontend.plist
        echo "Services started!"
        ;;
    stop)
        echo "Stopping SkillGlide services..."
        launchctl unload ~/Library/LaunchAgents/com.skillglide.backend.plist
        launchctl unload ~/Library/LaunchAgents/com.skillglide.frontend.plist
        echo "Services stopped!"
        ;;
    restart)
        echo "Restarting SkillGlide services..."
        launchctl unload ~/Library/LaunchAgents/com.skillglide.backend.plist
        launchctl unload ~/Library/LaunchAgents/com.skillglide.frontend.plist
        sleep 2
        launchctl load ~/Library/LaunchAgents/com.skillglide.backend.plist
        launchctl load ~/Library/LaunchAgents/com.skillglide.frontend.plist
        echo "Services restarted!"
        ;;
    status)
        echo "Checking SkillGlide services status..."
        echo "Backend service:"
        launchctl list | grep skillglide.backend
        echo "Frontend service:"
        launchctl list | grep skillglide.frontend
        echo ""
        echo "Checking if services are responding..."
        echo "Backend (port 8000):"
        curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "Not responding"
        echo ""
        echo "Frontend (port 5174):"
        curl -s -o /dev/null -w "%{http_code}" http://localhost:5174/ || echo "Not responding"
        ;;
    logs)
        echo "Backend logs:"
        tail -f logs/backend.log
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both services"
        echo "  stop    - Stop both services"
        echo "  restart - Restart both services"
        echo "  status  - Check service status and health"
        echo "  logs    - Show backend logs"
        exit 1
        ;;
esac 