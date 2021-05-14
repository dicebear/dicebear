import * as React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Configurator as ConfiguratorComponent } from '../components/Configurator';

export default function Configurator() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <ConfiguratorComponent />
    </Layout>
  );
}
