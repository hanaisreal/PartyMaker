# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PartyMaker is a static HTML landing page for a custom birthday party decoration service. The site collects email signups for a waitlist launching January 2025. This is a client-facing marketing website focused on conversions.

## Architecture

**Static Website Structure:**
- `index.html` - Main landing page with SEO optimization, structured data, and accessibility features
- `partymaker.html` - Alternative/simplified version of the main page with inline styles
- `thanks.html` - Thank you page after waitlist signup with confetti animation
- `assets/styles.css` - Main stylesheet with comprehensive responsive design
- `assets/script.js` - Interactive functionality for forms, animations, and modal galleries

**Key Technologies:**
- Pure HTML/CSS/JavaScript (no frameworks)
- Netlify Forms for waitlist capture
- Google Analytics integration (placeholder IDs)
- Responsive design with mobile-first approach
- Accessibility features (ARIA labels, semantic HTML, keyboard navigation)

## Key Features

**Landing Page (`index.html`):**
- Hero section with animated backgrounds
- Three-step process explanation
- Interactive mockup gallery with image sliders
- Waitlist signup form with Netlify integration
- Pricing section with early-bird offers
- FAQ section with expanding/collapsing answers
- Social proof counter with animation
- SEO optimized with Open Graph and Twitter meta tags

**Interactive Elements:**
- Auto-sliding mockup images on hover
- Modal gallery for viewing multiple product images
- Animated counter that increments on page load
- FAQ accordion functionality
- Smooth scrolling navigation
- Form validation and submission handling

## Development Workflow

**No Build Process:** This is a static site with no compilation steps. Files can be edited directly and deployed.

**Form Handling:** Uses Netlify Forms (data-netlify="true") - form submissions redirect to `/thanks.html`

**Analytics:** Google Analytics placeholder (`GA_MEASUREMENT_ID`) needs to be replaced with actual tracking ID

**Testing:** Open HTML files directly in browser or use a simple HTTP server

## Key Conventions

**CSS Architecture:**
- Mobile-first responsive design
- CSS custom properties for colors and gradients
- Animations using keyframes for engaging micro-interactions
- Accessibility-first focus states and screen reader support

**JavaScript Patterns:**
- Vanilla JavaScript with modern ES6+ features
- Event delegation and intersection observers for performance
- State management through DOM element properties
- Accessibility enhancements (ARIA attributes, keyboard navigation)

**Color Scheme:**
- Primary: #ff6b9d (Pink gradient)
- Secondary: #667eea (Purple gradient)
- Accent: #c44569 (Darker pink)
- Text: #2d3748 (Dark gray)
- Background: #fef7ed (Warm off-white)

## File Structure Notes

**Image References:** Uses placeholder images and references to `./pictures/` directory (images not included in repo)

**Netlify Configuration:** Form handling configured for Netlify deployment with honeypot spam protection

**SEO/Meta:** Comprehensive meta tags, structured data, and social media optimization already implemented

## Important Considerations

- Maintain accessibility standards (ARIA labels, semantic HTML, keyboard navigation)
- Keep mobile-first responsive design approach
- Preserve smooth animations and micro-interactions for engagement
- Ensure form validation works before submission
- Test modal gallery functionality across browsers
- Verify social proof counter animation triggers correctly