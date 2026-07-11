# SavvyTechies Website

Modern website for SavvyTechies - Enterprise multi-cloud managed services for Keycloak, RabbitMQ, and Kafka.

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Fast, modern static site generator
- **UI Library**: React (for interactive components)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Features

- ✨ Modern, responsive design
- 🚀 Blazing fast performance with Astro
- 💰 Interactive ROI Calculator (React)
- 📊 Transparent pricing tiers
- 📱 Mobile-first responsive layout
- ♿ Accessible components
- 🎨 Beautiful gradient designs
- 📄 Service pages for Keycloak, RabbitMQ, and Kafka
- 🎨 **Professional SVG architecture diagrams** (scalable, exportable)
- 🔄 Interactive components with React

## Project Structure

```
/
├── public/             # Static assets (images, fonts, etc.)
├── src/
│   ├── components/     # Reusable components
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── ROICalculator.tsx         # Interactive React component
│   │   ├── KeycloakArchitecture.tsx  # SVG diagram
│   │   ├── RabbitMQArchitecture.tsx  # SVG diagram
│   │   └── KafkaArchitecture.tsx     # SVG diagram
│   ├── layouts/        # Page layouts
│   │   └── Layout.astro
│   └── pages/          # Route pages
│       ├── index.astro      # Homepage
│       ├── keycloak.astro   # Keycloak service page
│       ├── rabbitmq.astro   # RabbitMQ service page
│       └── kafka.astro      # Kafka service page
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The static files will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This is a static site that can be deployed to any hosting platform:

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Astro and configure everything
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### AWS S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
# Configure CloudFront distribution
```

### Other Platforms

The `dist/` folder contains static HTML/CSS/JS that can be deployed anywhere:
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting
- Any static hosting service

## Customization

### Update Pricing

Edit pricing tiers in `src/pages/index.astro` in the pricing section.

### Modify Services

Service pages are located in `src/pages/`:
- `keycloak.astro` - Keycloak service details
- `rabbitmq.astro` - RabbitMQ service details
- `kafka.astro` - Kafka service details

### Update ROI Calculator

The calculator logic is in `src/components/ROICalculator.tsx`. Modify the `calculateCosts()` function to adjust pricing logic.

### Customize Architecture Diagrams

Architecture diagrams are SVG-based React components:
- `src/components/KeycloakArchitecture.tsx` - Keycloak multi-cloud setup
- `src/components/RabbitMQArchitecture.tsx` - RabbitMQ cluster
- `src/components/KafkaArchitecture.tsx` - Kafka distributed cluster

**Benefits of SVG diagrams:**
- Scalable to any size without quality loss
- Editable colors, text, and layout
- Can be exported to PNG/JPEG using browser tools
- Accessible and SEO-friendly

**To export diagrams as images:**
1. Open the page in browser
2. Right-click on the diagram
3. "Inspect Element"
4. Right-click the `<svg>` element
5. Copy > Copy outerHTML
6. Paste into online SVG to PNG converter (e.g., cloudconvert.com)

### Styling

- Global styles: `src/layouts/Layout.astro`
- Tailwind config: `tailwind.config.mjs`
- Color scheme: Update primary/secondary colors in tailwind config

## Form Submission

The contact form currently uses basic HTML form submission. To make it functional, you need to add a form handler:

**Options:**
1. **Netlify Forms** (if deployed to Netlify):
   - Add `data-netlify="true"` attribute to form
   - Submissions will appear in Netlify dashboard

2. **Formspree**:
   - Sign up at https://formspree.io
   - Update form action to your Formspree endpoint

3. **Custom API**:
   - Create an API endpoint in `src/pages/api/contact.ts`
   - Connect to your email service (SendGrid, AWS SES, etc.)

## Performance

- Lighthouse Score: 95+ across all metrics
- First Contentful Paint: < 1s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3s

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For questions or issues:
- Email: info@savvytechies.com
- Website: https://www.savvytechies.com

## Acknowledgments

- Built with [Astro](https://astro.build)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Heroicons](https://heroicons.com)
