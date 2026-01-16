import React from 'react';
import styles from './PropsTable.module.scss';

interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  title?: string;
  props: PropDefinition[];
}

export const PropsTable: React.FC<PropsTableProps> = ({ title, props }) => {
  return (
    <div className={styles.wrapper}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code className={styles.propName}>
                    {prop.name}
                    {prop.required && <span className={styles.required}>*</span>}
                  </code>
                </td>
                <td>
                  <code className={styles.propType}>{prop.type}</code>
                </td>
                <td>
                  {prop.default ? (
                    <code className={styles.propDefault}>{prop.default}</code>
                  ) : (
                    <span className={styles.noDefault}>—</span>
                  )}
                </td>
                <td className={styles.propDescription}>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

