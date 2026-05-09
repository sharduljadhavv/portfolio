'use client';
import Cursor from '@/components/shared/Cursor';
import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/Hero/Hero';
import Scene2 from '@/components/Scene2/Scene2';
import Scene3 from '@/components/Scene3/Scene3';
import FinalScene from '@/components/Final/FinalScene';
import Chatbot from '@/components/Chatbot/Chatbot';

export default function Home() {
  return (
    <>
      <Cursor />
      <Navbar />
      <Hero />
      <Scene2 />
      <Scene3 />
      <FinalScene />
      <Chatbot />
    </>
  );
}
