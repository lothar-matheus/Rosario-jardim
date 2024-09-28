import React, { useState, useEffect } from 'react';

const GrowingBranches = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = (scrollPosition / maxScroll) * 100;
      setScrollPercentage(Math.min(percentage, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div 
        className="branch left-branch" 
        style={{
          height: `${scrollPercentage}%`,
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)'
        }}
      />
      <div 
        className="branch right-branch" 
        style={{
          height: `${scrollPercentage}%`,
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)'
        }}
      />
      <style jsx>{`
        .branch {
          position: fixed;
          width: 100px;
          bottom: 0;
          background-repeat: no-repeat;
          background-position: bottom;
          background-size: contain;
          transition: height 0.3s ease-out;
          pointer-events: none;
        }
        .left-branch {
          left: 0;
          background-image: url('/imgs/left-branch.png');
        }
        .right-branch {
          right: 0;
          background-image: url('/imgs/right-branch.png');
          transform: scaleX(-1);
        }
      `}</style>
    </>
  );
};

export default GrowingBranches;