#!/bin/bash
cd /home/kavia/workspace/code-generation/file-system-access-agent-35886-34520/filesystem_agent_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

