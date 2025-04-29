# OneShotAI

OneShotAI is an AI-powered prompt engineering tool that generates highly effective one-shot prompts for AI developers based on user ideas. Built with Next.js and designed for rapid prototyping and deployment, it leverages the Mistral API for prompt generation.

## Features
- Generate optimized one-shot prompts for AI development
- Simple, intuitive web interface
- Powered by Mistral API
- Built with Next.js for fast performance and easy deployment

## Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/oneshotai.git
   cd oneshotai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Create a `.env.local` file in the root of the `oneshotai` directory.
   - Add your Mistral API key:
     ```env
     MISTRAL_API_KEY=your-mistral-api-key-here
     ```
   - **Do NOT commit `.env.local` or any API keys to version control.**

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

### Deployment on Vercel

1. **Push your repository to GitHub, GitLab, or Bitbucket.**
2. **Go to [Vercel](https://vercel.com/import) and import your project.**
3. **Set the required environment variable in the Vercel dashboard:**
   - `MISTRAL_API_KEY` (required)
4. **Deploy!**

For more details, see the [Vercel deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Environment Variables
- `MISTRAL_API_KEY`: Your API key for the Mistral API. **Required for both local development and production.**

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License
[MIT](LICENSE)

## Security
- Never commit API keys or secrets to the repository.
- Use environment variables for all sensitive information.

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Mistral AI](https://mistral.ai/)
- [Vercel](https://vercel.com/)
