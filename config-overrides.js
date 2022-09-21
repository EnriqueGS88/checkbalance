const webpack = require('webpack'); 
module.exports = function override(config) { 
		const fallback = config.resolve.fallback || {}; 
		Object.assign(fallback, { 
    	"crypto": require.resolve("crypto-browserify"), 
        "stream": require.resolve("stream-browserify"), 
        "assert": require.resolve("assert"), 
        "http": require.resolve("stream-http"), 
        "https": require.resolve("https-browserify"), 
        "os": require.resolve("os-browserify"), 
        "url": require.resolve("url"),
        "process/browser": require.resolve("process/browser")
      }) 
   config.resolve.fallback = fallback; 
   config.plugins = (config.plugins || []).concat([ 
   	new webpack.ProvidePlugin({ 
    	process: 'process/browser', 
      Buffer: ['buffer', 'Buffer'] 
    }) 
   ]) 
   
   return {
    ...config,
    ignoreWarnings: [
      {
        module: /node_modules\/@coinbase\/wallet-sdk\/node_modules\/eth-rpc-errors\/dist/,
      },
      {
        module: /node_modules\/@walletconnect\/crypto\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/browser-utils\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/client\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/core\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/encoding\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/environment\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/environment\/dist\/cjs/,
      },
      {
        module: /node_modules\/@walletconnect\/http-connection\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/iso-crypto\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/jsonrpc-types\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/randombytes\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/safe-json\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/socket-transport\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/utils\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/web3-provider\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/window-getters\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/window-getters\/dist\/cjs/,
      },
      {
        module: /node_modules\/@walletconnect\/jsonrpc-utils\/dist\/esm/,
      },
      {
        module: /node_modules\/@walletconnect\/window-metadata\/dist\/cjs/,
      },
      {
        module: /node_modules\/xhr2-cookies\/dist/,
      },
      {
        module: /node_modules\/json-rpc-engine\/node_modules\/eth-rpc-errors\/dist/,
      },
      {
        module: /node_modules\/json-rpc-engine\/dist/,
      },
      {
        module: /node_modules\/ethereumjs-abi\/node_modules\/ethereumjs-util\/dist/,
      },
      {
        module: /node_modules\/@metamask\/safe-event-emitter/,
      },
    ],
   }; 
  }