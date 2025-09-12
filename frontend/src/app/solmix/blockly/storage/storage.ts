/*
import { useEffect, useCallback, useRef } from 'react';

// Type definitions
interface BlocklyWorkspace {
  getTopBlocks(ordered: boolean): any[];
  addChangeListener(listener: () => void): void;
  removeChangeListener(listener: () => void): void;
  clear(): void;
}

interface BlocklyXml {
  workspaceToDom(workspace: BlocklyWorkspace, withId?: boolean): Document;
  domToText(dom: Document): string;
  domToWorkspace(dom: Document, workspace: BlocklyWorkspace): void;
}

interface BlocklyUtils {
  xml: {
    textToDom(text: string): Document;
  };
}

interface BlocklyAPI {
  getMainWorkspace(): BlocklyWorkspace;
  Xml: BlocklyXml;
  utils: BlocklyUtils;
}

declare global {
  interface Window {
    Blockly: BlocklyAPI;
  }
}

interface BlocklyStorageProps {
  workspace?: BlocklyWorkspace;
  storageEndpoint?: string;
  onAlert?: (message: string) => void;
  autoBackup?: boolean;
}

interface BlocklyStorageMessages {
  HTTPREQUEST_ERROR: string;
  LINK_ALERT: string;
  HASH_ERROR: string;
  XML_ERROR: string;
}

const DEFAULT_MESSAGES: BlocklyStorageMessages = {
  HTTPREQUEST_ERROR: 'There was a problem with the request.',
  LINK_ALERT: 'Share your blocks with this link:\n\n%1',
  HASH_ERROR: 'Sorry, "%1" doesn\'t correspond with any saved Blockly file.',
  XML_ERROR: 'Could not load your saved file. Perhaps it was created with a different version of Blockly?'
};

const useBlocklyStorageImpl = ({
  workspace,
  storageEndpoint = '/storage',
  onAlert = (message: string) => window.alert(message),
  autoBackup = true
}: BlocklyStorageProps) => {
  const httpRequestRef = useRef<XMLHttpRequest | null>(null);
  const changeListenerRef = useRef<(() => void) | null>(null);

  // Get workspace instance
  const getWorkspace = useCallback((): BlocklyWorkspace => {
    return workspace || window.Blockly?.getMainWorkspace();
  }, [workspace]);

  // Backup blocks to localStorage
  const backupBlocks = useCallback((targetWorkspace?: BlocklyWorkspace) => {
    if (typeof window === 'undefined' || !('localStorage' in window)) return;
    
    const ws = targetWorkspace || getWorkspace();
    if (!ws || !window.Blockly) return;

    try {
      const xml = window.Blockly.Xml.workspaceToDom(ws);
      const url = window.location.href.split('#')[0];
      const xmlText = window.Blockly.Xml.domToText(xml);
      window.localStorage.setItem(url, xmlText);
    } catch (error) {
      console.error('Failed to backup blocks:', error);
    }
  }, [getWorkspace]);

  // Restore blocks from localStorage
  const restoreBlocks = useCallback((targetWorkspace?: BlocklyWorkspace) => {
    if (typeof window === 'undefined' || !('localStorage' in window)) return;
    
    const url = window.location.href.split('#')[0];
    const savedXml = window.localStorage.getItem(url);
    
    if (!savedXml || !window.Blockly) return;

    try {
      const ws = targetWorkspace || getWorkspace();
      if (!ws) return;

      const xml = window.Blockly.utils.xml.textToDom(savedXml);
      window.Blockly.Xml.domToWorkspace(xml, ws);
    } catch (error) {
      console.error('Failed to restore blocks:', error);
    }
  }, [getWorkspace]);

  // Make HTTP request for cloud storage
  const makeRequest = useCallback((
    url: string,
    name: string,
    content: string,
    targetWorkspace: BlocklyWorkspace
  ) => {
    // Abort existing request
    if (httpRequestRef.current) {
      httpRequestRef.current.abort();
    }

    const xhr = new XMLHttpRequest();
    httpRequestRef.current = xhr;

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          onAlert(`${DEFAULT_MESSAGES.HTTPREQUEST_ERROR}\nhttpRequest_.status: ${xhr.status}`);
        } else {
          const data = xhr.responseText.trim();
          
          if (name === 'xml') {
            // Save operation - update URL hash and show link
            if (typeof window !== 'undefined') {
              window.location.hash = data;
              onAlert(DEFAULT_MESSAGES.LINK_ALERT.replace('%1', window.location.href));
            }
          } else if (name === 'key') {
            // Load operation
            if (!data.length) {
              onAlert(DEFAULT_MESSAGES.HASH_ERROR.replace('%1', window.location.hash));
            } else {
              // Remove poison line to prevent raw content from being served
              const cleanData = data.replace(/^\{\[\(\< UNTRUSTED CONTENT \>\)\]\}\n/, '');
              loadXml(cleanData, targetWorkspace);
            }
          }
          
          monitorChanges(targetWorkspace);
        }
        httpRequestRef.current = null;
      }
    };

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`${name}=${encodeURIComponent(content)}`);
  }, [onAlert]);

  // Load XML into workspace
  const loadXml = useCallback((xml: string, targetWorkspace: BlocklyWorkspace) => {
    if (!window.Blockly) return;

    try {
      const xmlDom = window.Blockly.utils.xml.textToDom(xml);
      targetWorkspace.clear();
      window.Blockly.Xml.domToWorkspace(xmlDom, targetWorkspace);
    } catch (error) {
      onAlert(`${DEFAULT_MESSAGES.XML_ERROR}\nXML: ${xml}\nError: ${error}`);
    }
  }, [onAlert]);

  // Monitor workspace changes and clear URL hash when modified
  const monitorChanges = useCallback((targetWorkspace: BlocklyWorkspace) => {
    if (!window.Blockly) return;

    // Remove existing listener
    if (changeListenerRef.current) {
      targetWorkspace.removeChangeListener(changeListenerRef.current);
    }

    const startXmlDom = window.Blockly.Xml.workspaceToDom(targetWorkspace);
    const startXmlText = window.Blockly.Xml.domToText(startXmlDom);
    
    const changeListener = () => {
      if (!window.Blockly) return;
      
      const xmlDom = window.Blockly.Xml.workspaceToDom(targetWorkspace);
      const xmlText = window.Blockly.Xml.domToText(xmlDom);
      
      if (startXmlText !== xmlText) {
        if (typeof window !== 'undefined') {
          window.location.hash = '';
        }
        targetWorkspace.removeChangeListener(changeListener);
        changeListenerRef.current = null;
      }
    };

    changeListenerRef.current = changeListener;
    targetWorkspace.addChangeListener(changeListener);
  }, []);

  // Create shareable link
  const createLink = useCallback((targetWorkspace?: BlocklyWorkspace) => {
    const ws = targetWorkspace || getWorkspace();
    if (!ws || !window.Blockly) return;

    const xml = window.Blockly.Xml.workspaceToDom(ws, true);
    
    // Remove x/y coordinates from XML if there's only one block stack
    if (ws.getTopBlocks(false).length === 1 && xml.querySelector) {
      const block = xml.querySelector('block');
      if (block) {
        block.removeAttribute('x');
        block.removeAttribute('y');
      }
    }
    
    const data = window.Blockly.Xml.domToText(xml);
    makeRequest(storageEndpoint, 'xml', data, ws);
  }, [getWorkspace, makeRequest, storageEndpoint]);

  // Retrieve XML from cloud storage using key
  const retrieveXml = useCallback((key: string, targetWorkspace?: BlocklyWorkspace) => {
    const ws = targetWorkspace || getWorkspace();
    if (!ws) return;

    makeRequest(storageEndpoint, 'key', key, ws);
  }, [getWorkspace, makeRequest, storageEndpoint]);

  // Set up auto-backup on page unload
  useEffect(() => {
    if (!autoBackup || typeof window === 'undefined') return;

    const handleUnload = () => {
      backupBlocks();
    };

    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [autoBackup, backupBlocks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (httpRequestRef.current) {
        httpRequestRef.current.abort();
      }
      
      if (changeListenerRef.current && workspace) {
        workspace.removeChangeListener(changeListenerRef.current);
      }
    };
  }, [workspace]);

  // Auto-restore blocks on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Small delay to ensure Blockly is fully initialized
      setTimeout(() => {
        restoreBlocks();
      }, 100);
    }
  }, [restoreBlocks]);

  // Return the storage methods for external use
  return {
    backupBlocks,
    restoreBlocks,
    createLink,
    retrieveXml,
    loadXml
  } as const;
};

export const useBlocklyStorage = (props?: BlocklyStorageProps) => {
  return useBlocklyStorageImpl(props || {});
};

export default useBlocklyStorage;
*/