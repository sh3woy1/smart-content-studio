export interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  variables?: string[];
  structure?: string;
  systemPrompt?: string;
}

export const contentTemplates: ContentTemplate[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    category: 'Content',
    systemPrompt: 'You are a professional blog writer who creates engaging, SEO-optimized content.',
    prompt: `Write a comprehensive blog post about {topic} that includes:
    - An attention-grabbing headline
    - An engaging introduction with a hook
    - 3-5 main sections with subheadings
    - Practical examples and actionable tips
    - A compelling conclusion with a call-to-action
    - SEO meta description
    
    Target audience: {audience}
    Tone: {tone}
    Word count: approximately {wordCount} words`,
    variables: ['topic', 'audience', 'tone', 'wordCount'],
  },
  {
    id: 'social-media-post',
    name: 'Social Media Post',
    category: 'Social',
    systemPrompt: 'You are a social media expert who creates viral, engaging content.',
    prompt: `Create a {platform} post about {topic} that:
    - Captures attention in the first line
    - Includes relevant hashtags
    - Has a clear call-to-action
    - Optimized for {platform} algorithm
    - Matches {tone} tone
    
    Include emojis where appropriate.`,
    variables: ['platform', 'topic', 'tone'],
  },
  {
    id: 'email-newsletter',
    name: 'Email Newsletter',
    category: 'Email',
    systemPrompt: 'You are an email marketing specialist.',
    prompt: `Write an email newsletter with:
    - Subject line: catchy and under 50 characters
    - Preview text
    - Greeting
    - Main content about {topic}
    - 2-3 sections with clear headings
    - Call-to-action button text
    - Sign-off
    
    Target audience: {audience}
    Purpose: {purpose}`,
    variables: ['topic', 'audience', 'purpose'],
  },
  {
    id: 'product-description',
    name: 'Product Description',
    category: 'Marketing',
    systemPrompt: 'You are a copywriter specializing in product descriptions that convert.',
    prompt: `Create a compelling product description for {productName}:
    - Eye-catching headline
    - Key benefits (not just features)
    - Unique selling proposition
    - Social proof elements
    - Technical specifications
    - Call-to-action
    
    Target market: {targetMarket}
    Price point: {pricePoint}`,
    variables: ['productName', 'targetMarket', 'pricePoint'],
  },
  {
    id: 'tutorial-guide',
    name: 'Tutorial Guide',
    category: 'Educational',
    systemPrompt: 'You are a technical writer who creates clear, easy-to-follow tutorials.',
    prompt: `Create a step-by-step tutorial for {topic}:
    - Clear introduction explaining what will be learned
    - Prerequisites/requirements
    - Numbered steps with detailed explanations
    - Screenshots/diagram descriptions where needed
    - Troubleshooting section
    - Summary and next steps
    
    Difficulty level: {difficulty}
    Target audience: {audience}`,
    variables: ['topic', 'difficulty', 'audience'],
  },
  {
    id: 'press-release',
    name: 'Press Release',
    category: 'PR',
    systemPrompt: 'You are a PR professional who writes newsworthy press releases.',
    prompt: `Write a press release about {announcement}:
    - FOR IMMEDIATE RELEASE header
    - Compelling headline
    - Location and date
    - Strong lead paragraph (who, what, when, where, why)
    - 2-3 supporting paragraphs with quotes
    - Company boilerplate
    - Contact information
    
    Company: {company}
    Quote from: {spokesperson}`,
    variables: ['announcement', 'company', 'spokesperson'],
  },
  {
    id: 'landing-page-copy',
    name: 'Landing Page Copy',
    category: 'Marketing',
    systemPrompt: 'You are a conversion copywriter specializing in landing pages.',
    prompt: `Create landing page copy for {product}:
    - Hero section headline and subheadline
    - Value proposition
    - 3 key benefits with descriptions
    - Social proof section
    - FAQ section (3-5 questions)
    - Strong CTA throughout
    
    Target audience: {audience}
    Main goal: {goal}`,
    variables: ['product', 'audience', 'goal'],
  },
  {
    id: 'case-study',
    name: 'Case Study',
    category: 'Content',
    systemPrompt: 'You are a business writer who creates compelling case studies.',
    prompt: `Write a case study about {client}:
    - Executive summary
    - The challenge/problem
    - The solution implemented
    - The results (with metrics)
    - Key takeaways
    - Client testimonial
    
    Industry: {industry}
    Results achieved: {results}`,
    variables: ['client', 'industry', 'results'],
  },
];

export function getTemplateById(id: string): ContentTemplate | undefined {
  return contentTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): ContentTemplate[] {
  return contentTemplates.filter(t => t.category === category);
}

export function fillTemplate(template: ContentTemplate, variables: Record<string, string>): string {
  let filledPrompt = template.prompt;
  
  template.variables?.forEach(variable => {
    const value = variables[variable] || `{${variable}}`;
    filledPrompt = filledPrompt.replace(new RegExp(`{${variable}}`, 'g'), value);
  });
  
  return filledPrompt;
}