import './Pricing.css';

const PricingTier = ({ name, price, period, description, features, recommended = false }) => (
  <div className={`pricing-card ${recommended ? 'recommended' : ''}`}>
    {recommended && <div className="pricing-badge">Recommended</div>}
    <div className="pricing-header">
      <h3 className="pricing-name">{name}</h3>
      <div className="pricing-price">
        <span className="price-currency">$</span>
        <span className="price-value">{price}</span>
        <span className="price-period">/{period}</span>
      </div>
      <p className="pricing-description">{description}</p>
    </div>
    <ul className="pricing-features">
      {features.map((feature, idx) => (
        <li key={idx} className="pricing-feature">
          <span className="feature-check">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`pricing-btn ${recommended ? 'primary' : 'secondary'}`}>
      {recommended ? 'Get Started' : 'Choose Plan'}
    </button>
  </div>
);

const CostBreakdown = ({ title, items }) => (
  <div className="cost-card">
    <h3 className="cost-title">{title}</h3>
    <div className="cost-items">
      {items.map((item, idx) => (
        <div key={idx} className="cost-item">
          <span className="cost-item-label">{item.label}</span>
          <span className="cost-item-value">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: '99',
      period: 'month',
      description: 'Perfect for small seed banks and research labs',
      features: [
        'Up to 5,000 seed accessions',
        '2 storage centers',
        'Basic monitoring',
        'Monthly reports',
        'Email support',
        'Standard backup (RPO 24h)'
      ]
    },
    {
      name: 'Professional',
      price: '299',
      period: 'month',
      description: 'For growing operations with multi-region needs',
      recommended: true,
      features: [
        'Unlimited seed accessions',
        '10 storage centers',
        'Advanced monitoring & alerts',
        'Custom reports & analytics',
        'Priority support (24/7)',
        'Premium backup (RPO 4h)',
        'Multi-region deployment',
        'Role-based access control'
      ]
    },
    {
      name: 'Enterprise',
      price: '899',
      period: 'month',
      description: 'For large-scale operations with SLA requirements',
      features: [
        'Unlimited everything',
        'Global multi-region deployment',
        'AI-powered analytics',
        'Custom integrations',
        'Dedicated account manager',
        'Disaster recovery (RPO 1h)',
        'Custom SLA options',
        'Onboarding & training'
      ]
    }
  ];

  const costBreakdowns = [
    {
      title: 'Compute Costs (AWS EC2)',
      items: [
        { label: 't3.medium (2 vCPU, 4GB)', value: '$33.12/mo' },
        { label: 't3.large (2 vCPU, 8GB)', value: '$66.24/mo' },
        { label: 'c5.xlarge (4 vCPU, 8GB)', value: '$140.16/mo' },
        { label: 'Multi-AZ deployment', value: '+100% cost' }
      ]
    },
    {
      title: 'Storage Costs',
      items: [
        { label: 'EBS gp3 (100 GB)', value: '$8.00/mo' },
        { label: 'S3 Standard (1 TB)', value: '$23.00/mo' },
        { label: 'S3 Glacier (1 TB)', value: '$4.00/mo' },
        { label: 'RDS PostgreSQL (db.t3.medium)', value: '$63.50/mo' }
      ]
    },
    {
      title: 'Network Costs',
      items: [
        { label: 'VPC & Security Groups', value: 'Free' },
        { label: 'Data Transfer (1 TB out)', value: '$90.00/mo' },
        { label: 'Load Balancer', value: '$16.42/mo' },
        { label: 'CloudFront CDN', value: '$0.085/GB' }
      ]
    },
    {
      title: 'Monitoring & Analytics',
      items: [
        { label: 'CloudWatch Basic', value: 'Free' },
        { label: 'CloudWatch Detailed', value: '$3.00/mo' },
        { label: 'AWS X-Ray', value: '$5.00/mo' },
        { label: 'Custom Dashboards', value: 'Included' }
      ]
    }
  ];

  return (
    <div className="pricing animate-slideUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pricing Strategy</h1>
          <p className="page-subtitle">
            Infrastructure cost estimates & subscription plans tailored for Seed Technology & Plant Genetics operations
          </p>
        </div>
      </div>

      {/* Pricing Tiers */}
      <section className="pricing-section">
        <h2 className="section-title">Subscription Plans</h2>
        <div className="pricing-grid">
          {tiers.map((tier, idx) => (
            <PricingTier key={idx} {...tier} />
          ))}
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="pricing-section">
        <h2 className="section-title">AWS Infrastructure Cost Breakdown</h2>
        <div className="cost-grid">
          {costBreakdowns.map((breakdown, idx) => (
            <CostBreakdown key={idx} {...breakdown} />
          ))}
        </div>
      </section>

      {/* Optimization Recommendations */}
      <section className="pricing-section">
        <div className="card optimization-card">
          <div className="card-header">
            <h3 className="card-title">💡 Optimization Recommendations</h3>
          </div>
          <div className="card-body">
            <ul className="optimization-list">
              <li className="optimization-item">
                <span className="optimization-icon">💰</span>
                <div className="optimization-content">
                  <h4>Reserved Instances</h4>
                  <p>Save up to 75% on EC2 costs with 1-3 year commitments</p>
                </div>
              </li>
              <li className="optimization-item">
                <span className="optimization-icon">📦</span>
                <div className="optimization-content">
                  <h4>S3 Lifecycle Policies</h4>
                  <p>Automatically archive old data to Glacier for cost savings</p>
                </div>
              </li>
              <li className="optimization-item">
                <span className="optimization-icon">⚡</span>
                <div className="optimization-content">
                  <h4>Auto-Scaling</h4>
                  <p>Scale resources based on demand to reduce idle costs</p>
                </div>
              </li>
              <li className="optimization-item">
                <span className="optimization-icon">🛡️</span>
                <div className="optimization-content">
                  <h4>RPO/RTO Alignment</h4>
                  <p>Match backup strategies to business requirements to avoid over-provisioning</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
