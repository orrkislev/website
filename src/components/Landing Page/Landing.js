'use client'

import React from 'react';
import ProjectsSection from './ProjectsSection';
import FeatureBoxes from './FeatureP5';
import HeroSection from './LandingHero';
import SketchesSection from './SketchesSection';
import SalesSection from './SalesSection';
import TutorialsSection from './Tutorials';
import { RecoilRoot } from 'recoil';
import AudienceSection from './AudienceSection';
import LandingFooter from './LandingFooter';
import LandingHeader from './LandingHeader';

export default function LandingPage() {
    return (
        <RecoilRoot>
            <div className="min-h-screen bg-stone-100 landing-main">
                <HeroSection />
                <FeatureBoxes />
                <AudienceSection />
                <SalesSection />
                <ProjectsSection />
                <TutorialsSection />
                <SketchesSection />
                <LandingFooter />
                <LandingHeader />
            </div>
        </RecoilRoot>
    )
}