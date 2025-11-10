import NeonVideoCard from '../ui/NeonVideoCard';

export default function VideoGrid({ isMobile, router }) {
  const mockVideos = [
    {
      id: '1',
      title: 'Building the Future of Decentralized Media on Sonic Blockchain - Live Demo & Tutorial',
      views: '152K',
      timestamp: '2 hours ago',
      channel: 'Web3 Innovators',
      channelId: 'web3innovators',
      duration: '28:15',
      verified: true
    },
    {
      id: '2',
      title: 'Live: SONIC Token Mining & Staking Strategies 2024 - Earn Passive Income',
      views: '89K',
      timestamp: 'LIVE NOW',
      channel: 'Crypto Masters',
      channelId: 'cryptomasters',
      duration: 'LIVE',
      verified: true
    },
    {
      id: '3',
      title: 'Creating Your First NFT Video Collection - Complete Step by Step Guide',
      views: '210K',
      timestamp: '1 day ago',
      channel: 'NFT Creator Pro',
      channelId: 'nftcreatorpro',
      duration: '45:22',
      verified: true
    },
  ];

  return (
    <div className={`
      ${isMobile
        ? 'space-y-8 px-6 pb-8'
        : 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 p-8'
      }
    `}>
      {mockVideos.map(video => (
        <NeonVideoCard
          key={video.id}
          video={video}
          isMobile={isMobile}
          onClick={() => router.push(`/watch/${video.id}`)}
        />
      ))}
    </div>
  );
}