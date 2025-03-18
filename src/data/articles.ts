import { slugify } from '../utilities/stringUtils';

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  publishedDate: string;
  readTime: string;
  coverImage: string;
  category: string;
  tags: string[];
  relatedArticles?: number[];
}

// Sample articles data
export const articles: Article[] = [
  {
    id: 1,
    title: 'The Future of Cryptocurrency: Trends to Watch in 2023',
    slug: 'the-future-of-cryptocurrency-trends-to-watch-in-2023',
    summary: 'Explore the emerging trends that will shape the cryptocurrency landscape in 2023 and beyond.',
    content: `
      <p>The cryptocurrency market has evolved significantly since the introduction of Bitcoin in 2009. As we move further into 2023, several key trends are emerging that could shape the future of digital assets.</p>
      
      <h2>1. Institution Adoption Continues to Grow</h2>
      <p>Major financial institutions are increasingly embracing cryptocurrencies. Banks like JPMorgan Chase, Goldman Sachs, and Morgan Stanley now offer crypto services to their clients. This institution adoption provides legitimacy to the market and attracts more traditional investors.</p>
      
      <h2>2. Regulatory Clarity Emerges</h2>
      <p>Governments worldwide are developing more comprehensive regulatory frameworks for cryptocurrencies. This increased clarity, while potentially restrictive in some aspects, provides a more stable environment for businesses and investors to operate in.</p>
      
      <h2>3. DeFi Innovation Accelerates</h2>
      <p>Decentralized Finance (DeFi) continues to innovate at a rapid pace. New protocols are emerging that offer more efficient lending, borrowing, and trading mechanisms. The total value locked in DeFi protocols has grown substantially, indicating strong user adoption.</p>
      
      <h2>4. NFTs Expand Beyond Digital Art</h2>
      <p>Non-fungible tokens (NFTs) are finding applications beyond digital art. They're now being used for real estate, identity verification, supply chain management, and more. This expansion demonstrates the versatility of blockchain technology.</p>
      
      <h2>5. Layer-2 Solutions Address Scalability</h2>
      <p>As blockchain networks face scalability challenges, Layer-2 solutions like Optimistic Rollups and Zero-Knowledge Rollups are gaining traction. These technologies allow for faster and cheaper transactions while maintaining security.</p>
      
      <h2>Conclusion</h2>
      <p>The cryptocurrency landscape is evolving rapidly, with innovations occurring across multiple fronts. While volatility remains a characteristic of the market, the underlying technology continues to mature and find real-world applications. Investors and enthusiasts should stay informed about these trends to navigate the changing environment effectively.</p>
    `,
    author: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Cryptocurrency analyst and blockchain technology expert with over 8 years of experience in the industry.'
    },
    publishedDate: 'June 15, 2023',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
    category: 'Cryptocurrency',
    tags: ['Bitcoin', 'Ethereum', 'DeFi', 'NFTs', 'Regulation'],
    relatedArticles: [2, 3]
  },
  {
    id: 2,
    title: "Understanding DeFi: A Beginner's Guide to Decentralized Finance",
    slug: 'understanding-defi-a-beginners-guide-to-decentralized-finance',
    summary: "Learn the basics of Decentralized Finance (DeFi) and how it's revolutionizing traditional financial systems.",
    content: `
      <p>Decentralized Finance, commonly known as DeFi, represents a paradigm shift in how financial services are delivered. Unlike traditional finance that relies on centralized intermediaries like banks, DeFi leverages blockchain technology to offer financial services directly between participants.</p>
      
      <h2>What is DeFi?</h2>
      <p>DeFi refers to a ecosystem of financial applications built on blockchain networks. These applications aim to recreate and improve upon traditional financial services like lending, borrowing, trading, and insurance without the need for intermediaries.</p>
      
      <h2>Key Components of DeFi</h2>
      
      <h3>Smart Contracts</h3>
      <p>Smart contracts are self-executing contracts with the terms directly written into code. They automatically enforce and execute agreements when predetermined conditions are met, eliminating the need for intermediaries.</p>
      
      <h3>Decentralized Exchanges (DEXs)</h3>
      <p>DEXs allow users to trade cryptocurrencies directly with one another without going through a centralized exchange. Popular examples include Uniswap, SushiSwap, and PancakeSwap.</p>
      
      <h3>Lending and Borrowing Platforms</h3>
      <p>Platforms like Aave and Compound allow users to lend their crypto assets and earn interest or borrow assets by providing collateral, all without traditional credit checks or intermediaries.</p>
      
      <h3>Stablecoins</h3>
      <p>Stablecoins are cryptocurrencies designed to maintain a stable value, often pegged to a fiat currency like the US dollar. They provide stability in the volatile crypto market and serve as a medium of exchange in DeFi.</p>
      
      <h2>Benefits of DeFi</h2>
      
      <ul>
        <li><strong>Accessibility:</strong> Anyone with an internet connection can access DeFi services, regardless of location or socioeconomic status.</li>
        <li><strong>Transparency:</strong> All transactions are recorded on a public blockchain, providing unprecedented transparency.</li>
        <li><strong>Interoperability:</strong> DeFi protocols can interact with each other, creating complex financial products and services.</li>
        <li><strong>Innovation:</strong> The open-source nature of DeFi encourages rapid innovation and experimentation.</li>
      </ul>
      
      <h2>Risks and Challenges</h2>
      
      <ul>
        <li><strong>Smart Contract Risks:</strong> Bugs or vulnerabilities in smart contracts can lead to loss of funds.</li>
        <li><strong>Regulatory Uncertainty:</strong> The regulatory landscape for DeFi is still evolving, creating uncertainty for users and developers.</li>
        <li><strong>User Experience:</strong> DeFi interfaces can be complex and intimidating for newcomers.</li>
        <li><strong>Volatility:</strong> The value of crypto assets can fluctuate dramatically, affecting DeFi activities.</li>
      </ul>
      
      <h2>Getting Started with DeFi</h2>
      
      <p>To begin exploring DeFi, you'll need:</p>
      
      <ol>
        <li>A cryptocurrency wallet (like MetaMask)</li>
        <li>Some cryptocurrency (often Ethereum)</li>
        <li>Basic knowledge of blockchain transactions</li>
      </ol>
      
      <p>Start with small amounts and gradually explore different protocols as you become more comfortable with the ecosystem.</p>
      
      <h2>Conclusion</h2>
      
      <p>DeFi represents a significant innovation in financial services, offering greater accessibility, transparency, and efficiency. While it comes with risks, the potential to transform how we interact with financial systems makes it an exciting space to watch and participate in.</p>
    `,
    author: {
      name: 'Sophia Chen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'DeFi researcher and educator focused on making blockchain technology accessible to everyone.'
    },
    publishedDate: 'May 22, 2023',
    readTime: '12 min read',
    coverImage: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
    category: 'DeFi',
    tags: ['DeFi', 'Blockchain', 'Smart Contracts', 'Ethereum', 'Finance'],
    relatedArticles: [1, 3]
  },
  {
    id: 3,
    title: 'NFTs Beyond Art: Exploring Practical Applications of Non-Fungible Tokens',
    slug: 'nfts-beyond-art-exploring-practical-applications-of-non-fungible-tokens',
    summary: 'Discover how NFTs are being used beyond digital art in industries ranging from real estate to supply chain management.',
    content: `
      <p>Non-fungible tokens (NFTs) burst into the mainstream consciousness primarily through digital art sales, with pieces selling for millions of dollars. However, the technology behind NFTs has far broader applications that extend well beyond the art world.</p>
      
      <h2>What Are NFTs?</h2>
      
      <p>NFTs are unique digital assets that represent ownership of a specific item or piece of content on a blockchain. Unlike cryptocurrencies such as Bitcoin or Ethereum, which are fungible (interchangeable), each NFT has distinct properties that make it unique and non-interchangeable.</p>
      
      <h2>Real Estate and Property Rights</h2>
      
      <p>NFTs are beginning to revolutionize real estate by tokenizing property ownership. This allows for:</p>
      
      <ul>
        <li>Fractional ownership of properties, making real estate investment more accessible</li>
        <li>Streamlined property transfers with reduced paperwork and intermediaries</li>
        <li>Transparent record of ownership history and property details</li>
        <li>Automated rental payments and property management through smart contracts</li>
      </ul>
      
      <h2>Identity Verification and Credentials</h2>
      
      <p>Educational institutions and professional organizations are exploring NFTs for:</p>
      
      <ul>
        <li>Issuing tamper-proof academic degrees and professional certifications</li>
        <li>Creating verifiable digital identities that users control</li>
        <li>Storing medical records securely while maintaining patient privacy</li>
        <li>Providing proof of attendance for events or experiences</li>
      </ul>
      
      <h2>Supply Chain Management</h2>
      
      <p>NFTs can transform supply chain management by:</p>
      
      <ul>
        <li>Tracking individual products from manufacture to delivery</li>
        <li>Verifying authenticity of luxury goods and preventing counterfeits</li>
        <li>Ensuring ethical sourcing of materials</li>
        <li>Creating transparent records of food production for safety and quality</li>
      </ul>
      
      <h2>Gaming and Virtual Worlds</h2>
      
      <p>The gaming industry has embraced NFTs for:</p>
      
      <ul>
        <li>In-game items that players truly own and can trade across platforms</li>
        <li>Virtual real estate in metaverse environments</li>
        <li>Character customizations and unique abilities</li>
        <li>Play-to-earn models that reward players with valuable assets</li>
      </ul>
      
      <h2>Ticketing and Event Access</h2>
      
      <p>NFTs are revolutionizing event ticketing by:</p>
      
      <ul>
        <li>Eliminating ticket fraud through blockchain verification</li>
        <li>Enabling controlled secondary market sales with royalties to original issuers</li>
        <li>Creating collectible memorabilia that increases in value</li>
        <li>Providing exclusive benefits to ticket holders before, during, and after events</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      
      <p>Despite their potential, NFTs face several challenges:</p>
      
      <ul>
        <li>Environmental concerns related to energy consumption</li>
        <li>Regulatory uncertainty in many jurisdictions</li>
        <li>Technical barriers to entry for average users</li>
        <li>Questions about long-term value and sustainability</li>
      </ul>
      
      <h2>Conclusion</h2>
      
      <p>While digital art has dominated NFT headlines, the technology's true potential lies in its broader applications across industries. As the technology matures and becomes more accessible, we can expect to see NFTs integrated into many aspects of our digital and physical lives, creating new opportunities for ownership, verification, and value exchange.</p>
    `,
    author: {
      name: 'Marcus Williams',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      bio: 'Technology journalist specializing in blockchain applications and digital innovation.'
    },
    publishedDate: 'April 10, 2023',
    readTime: '10 min read',
    coverImage: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1332&q=80',
    category: 'NFTs',
    tags: ['NFTs', 'Blockchain', 'Real Estate', 'Gaming', 'Supply Chain'],
    relatedArticles: [1, 2]
  }
];

// Function to get article by slug
export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

// Function to get article by ID
export const getArticleById = (id: number): Article | undefined => {
  return articles.find(article => article.id === id);
};

// Function to get related articles
export const getRelatedArticles = (articleId: number): Article[] => {
  const article = getArticleById(articleId);
  if (!article || !article.relatedArticles) return [];
  
  return article.relatedArticles.map(id => getArticleById(id)).filter(Boolean) as Article[];
}; 