// Global error handler for wallet extension conflicts
export const setupGlobalErrorHandler = () => {
  // Override console.error to filter out extension conflicts
  const originalConsoleError = console.error;
  
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out known extension conflict errors
    const shouldIgnore = [
      'Unexpected error',
      'evmAsk.js',
      'contentScript.ts',
      'browser-ponyfill',
      'utils-',
      'Failed to load module script',
      'MIME type',
      'Strict MIME type checking'
    ].some(ignoreText => message.includes(ignoreText));
    
    if (!shouldIgnore) {
      originalConsoleError.apply(console, args);
    }
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason || '';
    
    // Filter out extension-related errors
    const shouldIgnore = [
      'Unexpected error',
      'evmAsk.js',
      'contentScript.ts',
      'browser-ponyfill'
    ].some(ignoreText => message.includes(ignoreText));
    
    if (shouldIgnore) {
      event.preventDefault();
      console.log('Ignored extension conflict error:', message);
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    
    // Filter out extension-related errors
    const shouldIgnore = [
      'Unexpected error',
      'evmAsk.js',
      'contentScript.ts',
      'browser-ponyfill',
      'Failed to load module script'
    ].some(ignoreText => message.includes(ignoreText));
    
    if (shouldIgnore) {
      event.preventDefault();
      console.log('Ignored extension conflict error:', message);
    }
  });
};

// Wallet connection utilities
export const isWalletAvailable = (): boolean => {
  return typeof window.ethereum !== 'undefined' && 
         typeof window.ethereum.request === 'function';
};

export const waitForWallet = (timeout: number = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isWalletAvailable()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isWalletAvailable()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

export const safeWalletRequest = async (
  method: string, 
  params: any[] = [],
  timeout: number = 10000
): Promise<any> => {
  if (!isWalletAvailable()) {
    throw new Error('Wallet not available');
  }

  return Promise.race([
    window.ethereum!.request({ method, params }),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};
