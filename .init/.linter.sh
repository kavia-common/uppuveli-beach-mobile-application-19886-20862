#!/bin/bash
cd /home/kavia/workspace/code-generation/uppuveli-beach-mobile-application-19886-20862/WebAdminPanel
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

