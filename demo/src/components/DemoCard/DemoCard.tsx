import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import styles from './DemoCard.module.scss';

interface DemoCardProps {
  title: string;
  description: string;
  children: ReactNode;
  code: string;
  language?: string;
}

export const DemoCard: React.FC<DemoCardProps> = ({
  title,
  description,
  children,
  code,
  language = 'tsx',
}) => {
  const [showCode, setShowCode] = useState(false);

  const handleToggleCode = () => {
    setShowCode((prev) => !prev);
  };

  return (
    <div className={styles.card} id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <button
          className={`${styles.codeToggle} ${showCode ? styles.active : ''}`}
          onClick={handleToggleCode}
          type="button"
          aria-label={showCode ? 'Hide code' : 'Show code'}
          aria-expanded={showCode}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{showCode ? 'Hide Code' : 'View Code'}</span>
        </button>
      </div>

      <div className={styles.preview}>
        {children}
      </div>

      <div className={`${styles.codeWrapper} ${showCode ? styles.visible : ''}`}>
        <CodeBlock code={code} language={language} showLineNumbers />
      </div>
    </div>
  );
};

