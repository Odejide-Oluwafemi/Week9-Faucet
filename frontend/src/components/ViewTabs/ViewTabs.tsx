import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Tab } from '../../types';
import './ViewTabs.css';

interface ViewTabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOwner: boolean;
}

const ViewTabs: React.FC<ViewTabsProps> = ({ activeTab, setActiveTab, isOwner }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    faucet: null,
    transfer: null,
    mint: null,
    info: null,
  });
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const allTabs: { id: Tab, label: string }[] = [
    { id: 'faucet', label: 'Faucet' },
    { id: 'transfer', label: 'Token Interaction' },
    { id: 'mint', label: 'Mint (Admin)' },
    { id: 'info', label: 'Token Info' },
  ];

  const availableTabs = isOwner ? allTabs : allTabs.filter(tab => tab.id !== 'mint');

  // If a non-owner is on the mint tab (e.g. via URL) and then disconnects/switches accounts,
  // push them to the default tab.
  useEffect(() => {
    if (!isOwner && activeTab === 'mint') {
      setActiveTab('faucet');
    }
  }, [isOwner, activeTab, setActiveTab]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      const activeButton = tabRefs.current[activeTab];
      if (!container || !activeButton) return;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeButton.getBoundingClientRect();
      setIndicator({
        left: activeRect.left - containerRect.left + container.scrollLeft,
        width: activeRect.width,
        ready: true,
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab, availableTabs.length]);


  return (
    <div className="view-tabs" ref={containerRef}>
      <span
        className={`tab-indicator ${indicator.ready ? 'ready' : ''}`}
        style={{ width: `${indicator.width}px`, transform: `translateX(${indicator.left}px)` }}
      />
      {availableTabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          ref={(el) => {
            tabRefs.current[tab.id] = el;
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;
