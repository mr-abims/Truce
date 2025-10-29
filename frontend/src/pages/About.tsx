import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About: NextPage = () => {
  const teamMembers = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      image: '/images/mon1.png',
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      image: '/images/mon2.png',
    },
    {
      name: 'Marcus Williams',
      role: 'Head of Product',
      image: '/images/mon3.png',
    },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'All predictions and outcomes are verifiable on-chain, ensuring complete transparency.',
      icon: '/images/Icon1.png',
    },
    {
      title: 'Decentralization',
      description: 'Built on blockchain technology, eliminating single points of failure and censorship.',
      icon: '/images/Icon2.png',
    },
    {
      title: 'Community-Driven',
      description: 'Our platform is shaped by the collective wisdom and participation of our users.',
      icon: '/images/Icon3.png',
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Truce - About</title>
        <meta name="description" content="Learn about Truce and our mission" />
      </Head>

      <Navbar />

      <main className="flex-1 w-full flex justify-center">
        <div
          className="w-full"
          style={{
            maxWidth: '1312px',
            minWidth: '1200px',
            padding: '40px 64px',
          }}
        >
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-orbitron font-bold text-[48px] text-white mb-4">
              About Truce
            </h1>
            <p className="font-orbitron text-[18px] text-[#CCCCCC] max-w-[800px] mx-auto leading-relaxed">
              Truce is a decentralized prediction market platform built on blockchain technology. 
              We empower users to forecast future events and earn rewards for accurate predictions, 
              all while maintaining transparency and fairness.
            </p>
          </div>

          {/* Mission Section */}
          <div
            className="rounded-lg p-8 mb-16"
            style={{
              background: '#1a1a1a',
              border: '2px solid #00FF73',
              boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
            }}
          >
            <h2 className="font-orbitron font-semibold text-[32px] text-white mb-4 text-center">
              Our Mission
            </h2>
            <p className="font-orbitron text-[16px] text-[#CCCCCC] text-center max-w-[900px] mx-auto leading-relaxed">
              To democratize access to prediction markets and harness collective intelligence to forecast 
              the future. We believe that decentralized markets are more accurate, transparent, and accessible 
              than traditional forecasting methods. By leveraging blockchain technology, we create a trustless 
              environment where anyone can participate and benefit from their insights.
            </p>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="font-orbitron font-semibold text-[32px] text-white mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: '#1a1a1a',
                    border: '2px solid #00FF73',
                    boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      src={value.icon}
                      alt={value.title}
                      width={64}
                      height={64}
                      className="rounded"
                    />
                  </div>
                  <h3 className="font-orbitron font-bold text-[20px] text-[#00FF99] mb-3">
                    {value.title}
                  </h3>
                  <p className="font-orbitron text-[14px] text-[#CCCCCC] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="font-orbitron font-semibold text-[32px] text-white mb-8 text-center">
              Meet the Team
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: '#1a1a1a',
                    border: '2px solid #2F2F2F',
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="rounded-full"
                      style={{
                        border: '3px solid #00FF99',
                      }}
                    />
                  </div>
                  <h3 className="font-orbitron font-bold text-[20px] text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="font-orbitron text-[14px] text-[#00FF99]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Section */}
          <div
            className="rounded-lg p-8"
            style={{
              background: '#1a1a1a',
              border: '2px solid #00FF73',
              boxShadow: '0 0 18px #00FF99, 0 0 35px rgba(0, 255, 153, 0.4)',
            }}
          >
            <h2 className="font-orbitron font-semibold text-[32px] text-white mb-4 text-center">
              Built with Cutting-Edge Technology
            </h2>
            <p className="font-orbitron text-[16px] text-[#CCCCCC] text-center max-w-[900px] mx-auto leading-relaxed mb-6">
              Truce is powered by the Hedera network, providing fast, secure, and environmentally 
              sustainable transactions. Our smart contracts ensure that all market operations are 
              transparent, immutable, and executed fairly without intermediaries.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="font-orbitron font-bold text-[24px] text-[#00FF99] mb-2">
                  Hedera Network
                </div>
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">
                  Fast & Sustainable
                </div>
              </div>
              <div className="text-center">
                <div className="font-orbitron font-bold text-[24px] text-[#00FF99] mb-2">
                  Smart Contracts
                </div>
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">
                  Trustless Execution
                </div>
              </div>
              <div className="text-center">
                <div className="font-orbitron font-bold text-[24px] text-[#00FF99] mb-2">
                  HBAR Token
                </div>
                <div className="font-orbitron text-[14px] text-[#CCCCCC]">
                  Native Currency
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

