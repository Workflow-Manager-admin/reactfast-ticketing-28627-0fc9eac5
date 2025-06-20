#!/bin/bash
cd /home/kavia/workspace/code-generation/reactfast-ticketing-28627-0fc9eac5/ticketing_api_workspace/ticketing_api
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

