export default function (host, port, network_id) {
  return {
    networks: {
      development: {
        host: host || '127.0.0.1',     // Localhost (default: none)
        port: port || 7545,            // Standard Ethereum port (default: none)
        network_id: network_id || '*',       // Any network (default: none)
      }
    },

    // Configure your compilers
    compilers: {
      solc: {
        version: "0.8.15",
      }
    }
  }
};
