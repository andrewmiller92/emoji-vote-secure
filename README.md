# Emoji Vote Secure

A secure voting platform built with fully homomorphic encryption (FHE) to ensure complete privacy while maintaining transparent results.

## Features

- **Fully Private Voting**: FHE encryption ensures your vote is never revealed
- **Transparent Results**: See live results while maintaining complete voter privacy
- **Instant Voting**: Cast your encrypted vote instantly with just a tap
- **Wallet Integration**: Connect with your Web3 wallet for secure authentication
- **Real-time Updates**: Live poll results with encrypted vote counting

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- FHE (Fully Homomorphic Encryption)
- Web3 Wallet Integration

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/andrewmiller92/emoji-vote-secure.git

# Step 2: Navigate to the project directory
cd emoji-vote-secure

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This project can be deployed to Vercel or any other static hosting platform.

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy

## Security

This application uses fully homomorphic encryption to ensure that:
- Individual votes are never revealed
- Vote counting is performed on encrypted data
- Results are transparent while maintaining privacy
- All sensitive operations are performed on-chain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
