# Deployment Guide

## Vercel Deployment

### Prerequisites

1. A Vercel account
2. GitHub repository connected to Vercel
3. Environment variables configured

### Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add the following environment variables in Vercel dashboard:
   ```
   VITE_CONTRACT_ADDRESS=your_contract_address
   VITE_NETWORK_ID=11155111
   VITE_RPC_URL=your_rpc_url
   VITE_FHE_NETWORK_URL=https://api.zama.ai/fhevm
   VITE_FHE_CHAIN_ID=0x426
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at the provided URL

### Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate to be issued

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Contract Deployment

### Prerequisites

- Hardhat or Foundry
- FHEVM network access
- Private key with testnet ETH

### Deploy Contract

```bash
# Install hardhat dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile contract
npx hardhat compile

# Deploy to FHEVM testnet
npx hardhat run scripts/deploy.js --network fhevm
```

### Update Frontend

1. Copy the deployed contract address
2. Update `VITE_CONTRACT_ADDRESS` in environment variables
3. Redeploy frontend

## Security Considerations

- Never commit private keys or sensitive data
- Use environment variables for all configuration
- Enable HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

2. **Contract Connection Issues**
   - Verify contract address is correct
   - Check network configuration
   - Ensure RPC URL is accessible

3. **Wallet Connection Issues**
   - Verify MetaMask is installed
   - Check network configuration
   - Clear browser cache

### Support

For issues and questions:
- Check the GitHub Issues page
- Review the documentation
- Contact the development team
