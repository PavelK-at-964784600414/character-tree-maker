import { Metadata } from 'next';
import TreeManager from '@/components/TreeManager';

export const metadata: Metadata = {
  title: 'Character Trees | Tree Manager',
  description: 'Manage your character trees',
};

export default function TreesPage() {
  return <TreeManager />;
}
