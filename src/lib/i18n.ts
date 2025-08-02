import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr-CA'],
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    resources: {
      en: {
        navigation: {
          home: 'Home',
          adventures: 'Adventures',
          reviews: 'Reviews',
          about: 'About',
          blog: 'Blog',
          safety: 'Safety',
          contact: 'Contact',
        },
        common: {
          signIn: 'Sign In',
          signUp: 'Sign Up',
          bookNow: 'Book Now',
          learnMore: 'Learn More',
        },
        hero: {
          title_part1: 'Discover Your Ultimate',
          title_part2: 'Belize Adventure',
          subtitle: 'Join solo-friendly adventures through pristine jungles, ancient caves, and crystal-clear waters. Expert guides, sustainable travel, unforgettable memories.',
          rating: '4.9/5 Rating',
          reviews: '500+ Reviews',
          soloFriendly: 'Solo Friendly',
          smallGroups: 'Small Groups',
          fullyInsured: 'Fully Insured',
          atolProtected: 'ATOL Protected',
          sustainable: 'Sustainable',
          ecoCertified: 'Eco-Certified',
          bookNowPrice: 'Book Now - $',
          loadingTours: 'Loading Tours...',
          featuredAdventure: 'Featured Adventure:',
        },
        footer: {
          company: {
            description: 'Your trusted partner for unforgettable Belize adventures. Specializing in solo-friendly, sustainable travel experiences that connect you with nature and culture.',
          },
          sections: {
            quickLinks: 'Quick Links',
            popularAdventures: 'Popular Adventures',
            contactUs: 'Contact Us',
            certified: 'We\'re Certified',
          },
          quickLinks: {
            adventures: 'Adventures',
            aboutUs: 'About Us',
            reviews: 'Reviews',
            soloTravelGuide: 'Solo Travel Guide',
            safetyInformation: 'Safety Information',
            faq: 'FAQ',
          },
          adventures: {
            caveTubing: 'Cave Tubing',
            blueHoleDiving: 'Blue Hole Diving',
            mayaRuinsTours: 'Maya Ruins Tours',
            snorkelingTours: 'Snorkeling Tours',
            jungleZiplining: 'Jungle Zip-lining',
            wildlifeWatching: 'Wildlife Watching',
          },
          contact: {
            address1: 'San Pedro, Ambergris Caye',
            address2: 'Belize, Central America',
            phone: '+501-XXX-XXXX',
            email: 'hello@belizevibes.com',
          },
          legal: {
            copyright: '© 2024 BelizeVibes. All rights reserved.',
            privacyPolicy: 'Privacy Policy',
            termsOfService: 'Terms of Service',
            cookiePolicy: 'Cookie Policy',
          },
        },
        auth: {
          titles: {
            welcomeBack: 'Welcome Back!',
            joinBelizeVibes: 'Join BelizeVibes',
            resetPassword: 'Reset Password',
          },
          subtitles: {
            signIn: 'Sign in to book your next adventure',
            signUp: 'Start your adventure journey today',
            reset: 'We\'ll send you a link to reset your password',
          },
          buttons: {
            continueWithGoogle: 'Continue with Google',
            continueWithApple: 'Continue with Apple',
            continueWithInstagram: 'Continue with Instagram',
            preferred: 'Preferred',
            signIn: 'Sign In',
            signUp: 'Create Account',
            sendResetEmail: 'Send Reset Email',
            signingIn: 'Signing in...',
            creatingAccount: 'Creating account...',
            sendingEmail: 'Sending email...',
            createAccount: 'Create an account',
            forgotPassword: 'Forgot password?',
          },
          labels: {
            firstName: 'First Name',
            lastName: 'Last Name',
            accountType: 'Account Type',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            rememberMe: 'Remember me',
            agreeToTerms: 'I agree to the',
            termsOfService: 'Terms of Service',
            privacyPolicy: 'Privacy Policy',
            and: 'and',
          },
          placeholders: {
            selectRole: 'Select your role',
            enterEmail: 'Enter your email',
            enterPassword: 'Enter your password',
            confirmPassword: 'Confirm your password',
          },
          roles: {
            traveler: 'Traveler',
            guide: 'Tour Guide',
            admin: 'Admin',
          },
          separators: {
            orContinueWithEmail: 'Or continue with email',
          },
          footer: {
            newToBelizeVibes: 'New to BelizeVibes?',
            alreadyHaveAccount: 'Already have an account?',
            rememberPassword: 'Remember your password?',
            signInLink: 'Sign in',
          },
          validation: {
            emailRequired: 'Email is required',
            validEmailRequired: 'Please enter a valid email address',
            passwordRequired: 'Password is required',
            passwordMinLength: 'Password must be at least 8 characters',
            passwordUppercase: 'Password must contain an uppercase letter',
            passwordLowercase: 'Password must contain a lowercase letter',
            passwordNumber: 'Password must contain a number',
            passwordSpecialChar: 'Password must contain a special character',
          },
          messages: {
            passwordsDoNotMatch: 'Passwords do not match',
            acceptTerms: 'Please accept the terms and conditions',
            invalidCredentials: 'Invalid email or password',
            emailNotConfirmed: 'Please check your email and click the confirmation link',
            signInSuccess: 'Successfully signed in!',
            accountCreated: 'Account created! Please check your email for verification, then sign in to access your dashboard.',
            resetEmailSent: 'Password reset email sent! Check your inbox.',
            oauthFailed: 'Failed to sign in with',
            oauthRedirecting: 'Redirecting to',
            unexpectedError: 'An unexpected error occurred',
          },
        },
        testimonials: {
          header: 'What Solo Travelers Say',
          subtitle: 'Don\'t just take our word for it. Here\'s what our adventurous solo travelers have to say about their BelizeVibes experiences.',
          buttons: {
            writeReview: 'Write a Review',
            hideForm: 'Hide Review Form',
            submitReview: 'Submit Review',
            cancel: 'Cancel',
            loadMore: 'See More Reviews ({{count}} more)',
            loading: 'Loading...',
          },
          form: {
            title: 'Share Your BelizeVibes Experience',
            labels: {
              name: 'Your Name *',
              rating: 'Rating *',
              review: 'Your Review *',
              photos: 'Add Photos (Optional) - Up to {{max}} images',
            },
            placeholders: {
              name: 'Enter your name',
              review: 'Tell us about your experience with BelizeVibes...',
            },
            upload: {
              clickToUpload: 'Click to upload photos or drag and drop',
              maxReached: 'Maximum {{max}} images selected',
              fileTypes: 'PNG, JPG, GIF up to 5MB each',
              uploading: 'Uploading images...',
              selectedImages: 'Selected Images ({{count}}/{{max}})',
            },
            validation: {
              nameRequired: 'Name is required',
              contentRequired: 'Review content is required',
              contentMinLength: 'Review must be at least 10 characters long',
              ratingRequired: 'Please select a rating',
              maxImages: 'Maximum {{max}} images allowed',
              oversizedFiles: 'Some images are too large (max 5MB per image)',
              invalidFiles: 'You can only upload up to {{max}} images',
              notImage: '{{filename}} is not an image',
              tooLarge: '{{filename}} is too large (max 5MB)',
            },
            messages: {
              submitting: 'Submitting...',
              uploadingImages: 'Uploading Images...',
              success: 'Thank you for your review! It will be published after verification.',
              error: 'Failed to submit review. Please try again.',
              uploadError: 'Failed to upload images',
            },
          },
          stats: {
            averageRating: 'Average Rating',
            totalReviews: 'Total Reviews',
            soloTravelers: 'Solo Travelers',
            satisfaction: 'Satisfaction',
          },
          accessibility: {
            rateStar: 'Rate {{star}} star{{plural}}',
            reviewPhoto: 'Review photo {{index}} by {{name}}',
            photosCount: '{{count}} photo{{plural}} • Click to view full size',
            previewImage: 'Preview {{index}}',
          },
        },
        blog: {
          hero: {
            title: 'Solo Travel Guide',
            subtitle: 'Tips, stories, and inspiration for your Belize journey.',
            startReading: 'Start Reading',
          },
          main: {
            latestStories: 'Latest Stories',
            readMore: 'Read More',
          },
          sidebar: {
            popularTopics: 'Popular Topics',
            followUs: 'Follow Us',
            stayUpdated: 'Stay Updated',
            newsletterDescription: 'Get the latest travel tips and adventure stories delivered to your inbox.',
            emailPlaceholder: 'Enter your email',
            subscribe: 'Subscribe',
          },
          topics: {
            wildlife: 'Wildlife',
            safety: 'Safety',
            budgetTravel: 'Budget Travel',
            groupTours: 'Group Tours',
            jungleAdventures: 'Jungle Adventures',
            beachActivities: 'Beach Activities',
            culturalExperiences: 'Cultural Experiences',
            soloTips: 'Solo Tips',
            photography: 'Photography',
          },
          posts: {
            post1: {
              title: '10 Solo Adventures to Take in Belize',
              excerpt: 'From cave tubing to jungle zip-lining, discover the best solo-friendly adventures that Belize has to offer.',
              metaDescription: 'Discover the 10 best solo adventures in Belize including cave tubing, jungle zip-lining, Maya ruins exploration, and more. Complete guide for solo travelers.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Belize is a solo traveler's paradise, offering an incredible diversity of adventures that cater perfectly to independent explorers. From the moment you step off the plane, you'll discover a country that welcomes solo adventurers with open arms and provides experiences that will create memories to last a lifetime.</p>
                
                <p>This Central American gem boasts the world's second-largest barrier reef, ancient Maya ruins hidden deep in jungle canopies, and a culture that seamlessly blends Caribbean, Latin, and indigenous influences. What makes Belize particularly special for solo travelers is its English-speaking population, relatively small size, and well-established tourism infrastructure that makes navigation easy and safe.</p>

                <h2 id="section1">The Ultimate Solo Adventures</h2>
                
                <h3>1. Cave Tubing in the Caves Branch River</h3>
                <p>One of Belize's most iconic adventures, cave tubing offers a unique blend of relaxation and excitement. As you float through ancient limestone caves on an inner tube, you'll marvel at stalactites and stalagmites formed over millions of years. The experience typically lasts 3-4 hours and includes a moderate hike through the rainforest to reach the cave entrance.</p>
                <p>What makes this perfect for solo travelers is the group nature of the activity - you'll quickly bond with fellow adventurers while experienced guides ensure everyone's safety. The caves maintain a constant temperature of around 76°F (24°C), providing a refreshing break from Belize's tropical heat.</p>

                <h3>2. Exploring Caracol Maya Ruins</h3>
                <p>Deep in the Chiquibul Forest Reserve lies Caracol, Belize's largest Maya archaeological site. This ancient city once housed over 100,000 people and features the tallest man-made structure in Belize - the 143-foot Canaa pyramid. The journey to Caracol is an adventure in itself, requiring a 2.5-hour drive through jungle roads where you might spot jaguars, pumas, and over 300 bird species.</p>
                <p>Solo travelers particularly appreciate the spiritual solitude found at this remote site. Unlike busier ruins, Caracol offers the chance to explore largely undisturbed, climbing pyramids and wandering plazas with only the sounds of howler monkeys and tropical birds for company.</p>

                <h3>3. Diving the Blue Hole</h3>
                <p>The Blue Hole, a 400-foot-deep marine sinkhole, represents the holy grail of diving experiences. This UNESCO World Heritage site offers encounters with reef sharks, giant groupers, and unique geological formations. While advanced certification is required, the experience of descending into this natural wonder is unparalleled.</p>
                <p>For solo travelers, joining a diving group creates instant friendships with fellow underwater enthusiasts from around the world. The shared experience of witnessing one of Earth's most remarkable natural phenomena creates bonds that often last well beyond the trip.</p>

                <h3>4. Jungle Zip-lining Adventures</h3>
                <p>Soaring through the rainforest canopy provides a bird's-eye view of Belize's incredible biodiversity. Multiple zip-line courses throughout the country offer varying difficulty levels, from gentle glides suitable for beginners to heart-pounding runs for adrenaline seekers.</p>
                <p>The Mountain Pine Ridge area offers particularly spectacular zip-lining, with lines stretching over waterfalls and providing panoramic views of the jungle below. Solo travelers love the immediate camaraderie that develops in zip-line groups as everyone encourages each other to take the leap.</p>

                <h3>5. Snorkeling at Hol Chan Marine Reserve</h3>
                <p>Located just off Ambergris Caye, Hol Chan Marine Reserve offers some of the Caribbean's best snorkeling. The reserve's protected waters teem with tropical fish, rays, and nurse sharks. The famous "Shark Ray Alley" provides the thrilling experience of swimming alongside these gentle giants in their natural habitat.</p>
                <p>What makes this ideal for solo travelers is the ease of joining day trips from San Pedro. The shared boat experiences and underwater encounters create natural conversation starters and often lead to lasting friendships with fellow travelers.</p>

                <h2 id="section2">Planning Your Solo Adventure</h2>
                
                <h3>Best Time to Visit</h3>
                <p>Belize enjoys a tropical climate with two distinct seasons. The dry season (December to May) offers the most predictable weather and is ideal for most outdoor activities. However, this is also peak tourist season, meaning higher prices and more crowds at popular destinations.</p>
                <p>The rainy season (June to November) brings lower prices and fewer tourists, but also the possibility of afternoon showers and hurricane season (particularly August to October). Many solo travelers prefer the shoulder months of November and May, which offer a good balance of weather and value.</p>

                <h3>Transportation and Logistics</h3>
                <p>Belize's compact size makes it perfect for solo exploration. The country stretches only 290 miles north to south and 110 miles east to west. Domestic flights connect major destinations in under an hour, while bus services provide budget-friendly overland travel options.</p>
                <p>For maximum flexibility, many solo travelers rent cars for mainland exploration, while golf carts are the preferred mode of transport on the cayes. Water taxis efficiently connect the mainland to island destinations like Ambergris Caye and Caye Caulker.</p>

                <h2 id="conclusion">Conclusion</h2>
                <p>Belize offers an unmatched combination of adventure, culture, and natural beauty that makes it an ideal destination for solo travelers. Whether you're seeking heart-pounding adventures or peaceful moments in nature, this remarkable country provides experiences that will challenge, inspire, and rejuvenate you.</p>
                <p>The key to a successful solo adventure in Belize is embracing the unexpected, staying open to new experiences, and connecting with the warm, welcoming people who call this paradise home. Pack your sense of adventure, and prepare for the journey of a lifetime in beautiful Belize.</p>
              `,
            },
            post2: {
              title: 'How to Stay Safe While Traveling Alone',
              excerpt: 'Essential safety tips and precautions for solo travelers exploring Belize\'s beautiful landscapes.',
              metaDescription: 'Essential safety guide for solo travelers in Belize. Learn about personal security, health precautions, emergency contacts, and travel insurance tips.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Solo travel in Belize can be one of the most rewarding experiences of your life, offering freedom, self-discovery, and incredible adventures. However, traveling alone also requires extra attention to safety and preparation. This comprehensive guide will equip you with essential knowledge to explore Belize confidently and securely.</p>
                
                <p>Belize is generally considered one of the safer Central American destinations for solo travelers, particularly in tourist areas. The country's English-speaking population, stable democracy, and well-developed tourism infrastructure contribute to a relatively safe environment. However, like any international destination, being prepared and aware is crucial for a successful solo adventure.</p>

                <h2 id="section1">Pre-Travel Preparation</h2>
                
                <h3>Research and Planning</h3>
                <p>Thorough research forms the foundation of safe solo travel. Before departing, familiarize yourself with current political situations, weather patterns, and any travel advisories issued by your government. The U.S. State Department, UK Foreign Office, and similar agencies provide up-to-date country information and safety assessments.</p>
                <p>Create detailed itineraries including accommodation addresses, transportation schedules, and activity bookings. Share these with trusted contacts at home, establishing regular check-in schedules. This creates a safety net ensuring someone knows your whereabouts at all times.</p>

                <h3>Health Preparations</h3>
                <p>Visit a travel medicine clinic at least 4-6 weeks before departure. Belize requires no vaccinations for entry, but doctors typically recommend hepatitis A and B, typhoid, and routine vaccinations including measles, mumps, rubella, and influenza. Consider malaria prophylaxis if traveling to rural areas, particularly during rainy season.</p>
                <p>Pack a comprehensive first aid kit including prescription medications (in original containers), basic bandages, antiseptic wipes, pain relievers, anti-diarrheal medication, and any personal medical necessities. Include copies of prescriptions and medical insurance cards.</p>

                <h3>Travel Insurance</h3>
                <p>Comprehensive travel insurance is non-negotiable for solo travelers. Ensure coverage includes emergency medical evacuation, trip cancellation, lost luggage, and adventure activities like diving or zip-lining. Many standard policies exclude "adventure sports," so verify coverage for planned activities.</p>
                <p>Research medical facilities in your destination areas. Belize City and San Pedro have the most advanced medical facilities, while remote areas may require evacuation for serious injuries or illnesses.</p>

                <h2 id="section2">On-Ground Safety Strategies</h2>
                
                <h3>Accommodation Security</h3>
                <p>Choose accommodations carefully, prioritizing security over savings. Look for properties with 24-hour front desk service, secure entrances, safes in rooms, and positive recent reviews from solo travelers. Mid-range hotels and established hostels typically offer the best security-to-value ratio.</p>
                <p>Upon arrival, note emergency exits, keep rooms locked at all times, and use provided safes for passports, excess cash, and electronics. Avoid displaying room numbers publicly and be discreet when entering your room.</p>

                <h3>Transportation Safety</h3>
                <p>Use reputable transportation services whenever possible. For domestic flights, Maya Island Air and Tropic Air maintain excellent safety records. When using taxis, choose established companies or ask accommodations to arrange transportation. Avoid flagging random vehicles on streets.</p>
                <p>If renting a car, inspect the vehicle thoroughly, ensure proper insurance coverage, and avoid driving at night outside major towns. Keep doors locked and windows partially closed while driving, and never leave valuables visible in parked cars.</p>

                <h3>Personal Security Measures</h3>
                <p>Maintain low profiles by dressing conservatively and avoiding flashy jewelry or expensive electronics in public. Carry minimal cash and cards, leaving extras secured at accommodations. Distribute money across multiple locations including hidden pockets, hotel safes, and emergency reserves.</p>
                <p>Trust your instincts - if situations feel uncomfortable, remove yourself immediately. Avoid walking alone after dark, particularly in Belize City and other urban areas. Stick to well-lit, populated areas when possible.</p>

                <h2 id="conclusion">Emergency Preparedness and Contacts</h2>
                
                <h3>Important Numbers</h3>
                <p>Police Emergency: 911<br>
                Tourist Police: 227-2222<br>
                Fire Department: 911<br>
                Medical Emergency: 911<br>
                Your Embassy/Consulate (store in phone)</p>

                <h3>Communication Strategies</h3>
                <p>Maintain multiple communication methods including international phone plans, local SIM cards, and WiFi calling apps. Inform contacts of communication schedules and have backup plans if primary methods fail. Consider satellite communicators for remote area travel.</p>
                <p>Download offline maps and translation apps before traveling to remote areas with limited connectivity. Google Translate's camera function can be invaluable for reading signs or menus in local languages.</p>

                <p>Remember, the goal isn't to be paranoid but prepared. Most solo travelers experience Belize safely and have incredible adventures. By following these guidelines and trusting your instincts, you'll be well-equipped to explore this beautiful country confidently and securely.</p>
              `,
            },
            post3: {
              title: 'A Week in San Ignacio: Budget & Luxury Picks',
              excerpt: 'Whether you\'re backpacking or splurging, here\'s how to make the most of San Ignacio\'s adventure scene.',
              metaDescription: 'Complete 7-day San Ignacio travel guide with budget and luxury options. Discover Maya ruins, jungle adventures, and local culture in western Belize.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>San Ignacio, nestled in western Belize's Cayo District, serves as the perfect base for exploring some of the country's most spectacular attractions. This charming town, with its laid-back atmosphere and strategic location near the Guatemalan border, offers access to ancient Maya ruins, pristine jungle reserves, and some of Central America's most thrilling adventures.</p>
                
                <p>What makes San Ignacio special is its ability to cater to every type of traveler and budget. Whether you're a backpacker counting every dollar or seeking luxury experiences, this comprehensive week-long itinerary will help you discover the best of what this remarkable region has to offer.</p>

                <h2 id="section1">Days 1-2: Arrival and Town Exploration</h2>
                
                <h3>Budget Option</h3>
                <p>Arrive via chicken bus from Belize City (BZ$8, 3 hours) for an authentic local experience. Stay at The Trek Stop (BZ$30/night), a beloved backpacker haven with camping options, communal kitchens, and a vibrant social atmosphere where travelers from around the world gather to share stories and plan adventures.</p>
                <p>Explore San Ignacio Market for budget-friendly local meals featuring rice and beans, stew chicken, and fresh tropical fruits. A hearty meal costs around BZ$10-15. Visit the free Cahal Pech Maya site for sunset views over the Macal River valley.</p>

                <h3>Luxury Option</h3>
                <p>Arrange private transfer from international airport (BZ$400) and stay at Ka'ana Resort (BZ$800+/night), an award-winning eco-luxury property featuring private casitas, infinity pools, and world-class spa services surrounded by pristine rainforest.</p>
                <p>Dine at Running W Steakhouse (BZ$80-120/person) for premium steaks and international cuisine, or enjoy Ka'ana's farm-to-table restaurant featuring locally sourced ingredients and expertly crafted cocktails while watching exotic birds and iguanas in the resort's gardens.</p>

                <h3>Both Options</h3>
                <p>Explore downtown San Ignacio's colorful markets, colonial architecture, and friendly local atmosphere. Visit the Saturday market for local crafts, fresh produce, and traditional foods. Take a leisurely walk across the Hawksworth Bridge for panoramic views of the Macal River and surrounding hills.</p>

                <h2 id="section2">Days 3-4: Ancient Maya Wonders</h2>
                
                <h3>Caracol and Mountain Pine Ridge</h3>
                <p>Budget travelers can join group tours (BZ$180/person) that include transportation, guide services, and entrance fees to Caracol, Belize's largest Maya site. These full-day excursions typically include stops at Rio On Pools and Big Rock Falls for refreshing swims in crystal-clear mountain pools.</p>
                <p>Luxury travelers can arrange private guided tours (BZ$800-1200/day) with expert archaeologists, gourmet picnic lunches, and comfortable 4WD vehicles. Private tours allow flexible timing, in-depth historical discussions, and access to lesser-known sites like Rio Frio Caves.</p>

                <h3>Xunantunich Maya Site</h3>
                <p>Budget option: Take local bus to San Jose Succotz (BZ$3), hand-cranked ferry across Mopan River (BZ$2), then taxi to ruins (BZ$20 round trip). Entrance fee BZ$10. Bring water and snacks for a self-guided exploration of El Castillo pyramid and surrounding plazas.</p>
                <p>Luxury option: Private guided tour (BZ$400/day) including transportation, expert guide, and gourmet lunch. Combine with visits to local artisan communities and private butterfly farm tours showcasing Belize's incredible biodiversity.</p>

                <h2 id="section3">Days 5-6: Adventure Activities</h2>
                
                <h3>Cave Adventures</h3>
                <p>ATM Cave (Actun Tunichil Muknal) offers one of Belize's most spectacular adventures. Budget travelers can book group tours (BZ$180/person) that include transportation, guide, helmet, and headlamp. This full-day adventure involves swimming through underground rivers and hiking through ancient ceremonial chambers.</p>
                <p>Luxury travelers can arrange smaller group sizes (BZ$400/person) with premium guides, better equipment, and more personalized attention. Some operators offer photographer guides to capture professional-quality images of this once-in-a-lifetime experience.</p>

                <h3>River Adventures</h3>
                <p>Budget: Canoe rental on Macal River (BZ$40/day) for self-guided exploration. Paddle to Chaa Creek Natural History Centre (free with lunch purchase) or simply enjoy peaceful river floating while watching iguanas, tropical birds, and occasional crocodiles.</p>
                <p>Luxury: Private guided canoe tours (BZ$200/person) with naturalist guides, gourmet riverside lunches, and stops at exclusive locations. Some tours include traditional Maya cooking classes and visits to medicinal plant trails with indigenous guides.</p>

                <h2 id="conclusion">Day 7: Departure Options</h2>
                
                <h3>Budget Farewell</h3>
                <p>Take chicken bus back to Belize City (BZ$8) with stops at local villages for authentic cultural experiences. Purchase last-minute souvenirs at San Ignacio Market including handcrafted Maya textiles, carved wooden masks, and locally produced hot sauces.</p>

                <h3>Luxury Departure</h3>
                <p>Private transfer to international airport (BZ$400) with stops at Black Orchid Resort spa for farewell massage treatments, or extend with luxury domestic flight to Ambergris Caye for beach relaxation.</p>

                <p>San Ignacio offers the perfect blend of adventure, culture, and natural beauty regardless of your budget. The key is choosing experiences that align with your travel style while remaining open to the unexpected encounters that make Belize truly magical. Whether sleeping in a backpacker bunk or luxury suite, the Maya ruins, jungle adventures, and warm Belizean hospitality remain equally accessible and unforgettable.</p>
              `,
            },
            post4: {
              title: 'Wildlife Watching: A Solo Traveler\'s Guide',
              excerpt: 'Spot jaguars, howler monkeys, and exotic birds on your own terms with these wildlife watching tips.',
              metaDescription: 'Complete wildlife watching guide for solo travelers in Belize. Learn to spot jaguars, howler monkeys, toucans, and other exotic animals safely.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Belize is a wildlife enthusiast's dream destination, home to over 500 bird species, 145 mammal species, and countless reptiles and amphibians. For solo travelers, wildlife watching offers moments of profound connection with nature and opportunities for incredible photography. This comprehensive guide will help you maximize your wildlife encounters while traveling independently in Belize.</p>
                
                <p>The country's diverse ecosystems - from coral reefs to tropical rainforests, mangrove swamps to pine savannas - provide habitats for an extraordinary variety of species. Many animals are endemic to Central America, making Belize a unique destination for wildlife observation. Solo travelers often have advantages in wildlife watching, moving quietly and patiently through environments where group tours might disturb sensitive animals.</p>

                <h2 id="section1">Prime Wildlife Watching Locations</h2>
                
                <h3>Cockscomb Basin Wildlife Sanctuary</h3>
                <p>Known as the world's first jaguar preserve, Cockscomb Basin offers the best chance to spot these elusive big cats in the wild. While jaguar sightings are rare and require patience, the sanctuary guarantees encounters with howler monkeys, toucans, and over 290 bird species. Solo travelers appreciate the sanctuary's well-marked hiking trails and comfortable accommodations.</p>
                <p>Early morning visits yield the highest wildlife activity. The Victoria Peak Trail challenges experienced hikers with potential sightings of ocelots, margays, and the rare Baird's tapir. Night tours reveal a completely different ecosystem with bats, owls, and nocturnal mammals.</p>

                <h3>Belize Zoo and Tropical Education Center</h3>
                <p>Often called "the best little zoo in the world," the Belize Zoo houses only native species in natural habitats. This is your guaranteed opportunity to see jaguars, pumas, ocelots, jaguarundis, and margays up close. The zoo's night tours provide thrilling encounters with nocturnal predators in their most active state.</p>
                <p>Solo travelers love the educational programs and photography workshops offered throughout the year. The adjacent Tropical Education Center provides overnight accommodations in the heart of the zoo, allowing dawn and dusk wildlife observation when animals are most active.</p>

                <h3>Crooked Tree Wildlife Sanctuary</h3>
                <p>This 16,400-acre lagoon system hosts Belize's largest concentration of migratory birds. Between November and May, thousands of birds including jabiru storks, great blue herons, and snowy egrets congregate here. The sanctuary's elevated walkways and observation towers provide excellent vantage points for photography and observation.</p>
                <p>Solo travelers can explore by canoe, moving silently through waterways where caimans, iguanas, and countless bird species thrive. Local guides offer specialized knowledge about seasonal migrations and optimal viewing times.</p>

                <h2 id="section2">Essential Wildlife Watching Tips</h2>
                
                <h3>Timing and Behavior</h3>
                <p>Wildlife activity peaks during dawn and dusk when temperatures are cooler and animals emerge to feed. Plan your most important wildlife watching sessions during these golden hours. Midday heat drives most mammals to shelter, but reptiles and some bird species remain active.</p>
                <p>Move slowly and quietly through natural environments. Sudden movements and loud noises will scatter wildlife before you have observation opportunities. Solo travelers have advantages here - you control your pace and noise level without group dynamics.</p>

                <h3>Photography and Equipment</h3>
                <p>Bring binoculars for distant wildlife observation and telephoto lenses for photography. A 300mm lens minimum is recommended for bird photography, while mammal photography may require longer focal lengths. Pack extra batteries and memory cards - wildlife encounters often happen quickly.</p>
                <p>Consider hiring local guides who know animal behavior patterns and seasonal movements. Their expertise dramatically increases your chances of meaningful wildlife encounters while ensuring your safety in remote areas.</p>

                <h2 id="conclusion">Safety and Conservation</h2>
                <p>Respect wildlife by maintaining safe distances and never feeding animals. Feeding disrupts natural behavior patterns and can make animals aggressive or dependent on humans. Follow Leave No Trace principles and support conservation efforts through responsible tourism choices.</p>
                <p>Solo wildlife watching in Belize offers unparalleled opportunities for personal connection with nature. Whether photographing a resplendent quetzal or listening to howler monkey calls echo through the jungle, these encounters will create lasting memories and deepen your appreciation for Belize's incredible biodiversity.</p>
              `,
            },
            post5: {
              title: 'Budget-Friendly Belize: Solo Travel on $50/Day',
              excerpt: 'Discover how to experience Belize\'s wonders without breaking the bank, from hostels to street food.',
              metaDescription: 'Complete budget travel guide for Belize on $50/day. Learn about cheap accommodations, local food, free activities, and money-saving tips for solo travelers.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Contrary to popular belief, Belize doesn't have to break the bank. While it's true that Belize can be expensive compared to other Central American destinations, savvy solo travelers can experience this incredible country on a budget of $50 per day or less. This comprehensive guide reveals insider secrets for affordable accommodations, delicious local meals, free activities, and money-saving strategies.</p>
                
                <p>The key to budget travel in Belize lies in embracing local culture, staying in budget accommodations, eating where locals eat, and taking advantage of free or low-cost activities. Solo travelers have additional advantages - you can be flexible with your plans, take advantage of last-minute deals, and easily connect with other budget travelers for cost-sharing opportunities.</p>

                <h2 id="section1">Budget Accommodation Strategies</h2>
                
                <h3>Hostels and Guesthouses ($15-25/night)</h3>
                <p>Belize has a growing network of backpacker hostels offering dormitory beds for $15-25 BZD per night. Popular options include The Trek Stop in San Ignacio, Bella's Backpackers in Caye Caulker, and Ruby's Hotel in San Pedro. These establishments often include kitchen facilities, allowing you to prepare your own meals and save significantly on food costs.</p>
                <p>Local guesthouses provide authentic experiences at budget prices. Family-run establishments often offer breakfast and local insights that chain hotels cannot match. Book directly with properties to avoid booking fees and sometimes negotiate better rates for longer stays.</p>

                <h3>Alternative Accommodations</h3>
                <p>Consider camping options where available - some hostels offer tent sites for $10-15 BZD per night. House-sitting opportunities exist in expat communities, particularly around San Pedro and Placencia. Online platforms connect travelers with homeowners needing property caretakers during their absence.</p>
                <p>Couchsurfing has a small but active community in Belize, particularly in Belize City and San Ignacio. This option provides free accommodation plus local insider knowledge from your hosts.</p>

                <h2 id="section2">Eating on a Budget</h2>
                
                <h3>Local Food Scene ($3-8/meal)</h3>
                <p>Street food and local eateries offer authentic Belizean cuisine at fraction of tourist restaurant prices. A plate of rice and beans with chicken costs $6-8 BZD at local restaurants. Street vendors sell delicious breakfast burritos for $3-4 BZD and fresh fruit for under $2 BZD.</p>
                <p>Visit local markets for incredibly cheap produce, fresh bread, and traditional snacks. Belize City's Central Market and San Ignacio's Saturday Market offer the best prices and selection. Stock up on fruits, vegetables, and basics for self-catered meals.</p>

                <h3>Self-Catering Strategies</h3>
                <p>Choose accommodations with kitchen facilities and cook your own meals. Local supermarkets like Brodies and Save-U offer reasonable prices for staples. A week's worth of groceries costs $40-60 BZD if you shop smartly and cook most meals yourself.</p>
                <p>Pack a reusable water bottle and use filtered water stations available at most hostels. Bottled water costs add up quickly in tropical climates where you need constant hydration.</p>

                <h2 id="section3">Free and Low-Cost Activities</h2>
                
                <h3>Natural Attractions</h3>
                <p>Many of Belize's best attractions are free or very low cost. Hiking trails in Mountain Pine Ridge, swimming at natural pools like Rio On Pools and Big Rock Falls, and exploring Cahal Pech Maya ruins (free admission) provide incredible experiences without admission fees.</p>
                <p>Beach access is free throughout Belize. Spend days swimming, snorkeling from shore, and beachcombing without paying resort fees. Public beaches at Hopkins, Placencia, and Caye Caulker offer world-class experiences at no cost.</p>

                <h3>Cultural Experiences</h3>
                <p>Attend local festivals and events for authentic cultural immersion. Many communities host free music performances, traditional dance shows, and cultural celebrations throughout the year. Check community centers and local newspapers for upcoming events.</p>
                <p>Walking tours of historical areas like Belize City's colonial district and San Ignacio's downtown provide cultural education at no cost. Many sites offer free self-guided tour materials.</p>

                <h2 id="conclusion">Money-Saving Transportation Tips</h2>
                <p>Use local buses instead of tourist shuttles - chicken buses cost $3-8 BZD for long-distance routes compared to $25-40 BZD for tourist transportation. Buses run regularly between major destinations and provide authentic local experiences.</p>
                <p>Budget travel in Belize requires planning and flexibility, but the rewards are immense. You'll experience authentic local culture, meet fellow budget travelers from around the world, and prove that incredible adventures don't require unlimited budgets. With careful planning and local knowledge, $50/day provides comfortable accommodation, delicious meals, and unforgettable experiences throughout beautiful Belize.</p>
              `,
            },
            post6: {
              title: 'The Best Time to Visit Belize for Solo Travelers',
              excerpt: 'Weather, crowds, and costs - everything you need to know about timing your solo Belize adventure.',
              metaDescription: 'Complete seasonal guide for solo travel to Belize. Learn about weather patterns, tourist seasons, costs, and optimal timing for different activities.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Timing your solo adventure to Belize can dramatically impact your experience, budget, and safety. This tropical paradise enjoys year-round warmth, but distinct wet and dry seasons create significant differences in weather patterns, tourist crowds, prices, and activity availability. Understanding these seasonal variations helps solo travelers optimize their Belizean adventure for their specific priorities and preferences.</p>
                
                <p>Belize's location in the Caribbean basin means it experiences typical tropical weather patterns with two main seasons. However, microclimates vary significantly across the country - coastal areas differ from inland mountains, and northern regions experience different patterns than southern areas. This guide breaks down optimal timing for various activities and travel styles.</p>

                <h2 id="section1">Dry Season: December to May</h2>
                
                <h3>Peak Season (December-April)</h3>
                <p>The dry season represents Belize's peak tourist period, bringing the most predictable weather but also the highest prices and largest crowds. Daily temperatures range from 70-85°F (21-29°C) with minimal rainfall and consistent trade winds providing natural air conditioning. This period offers optimal conditions for all outdoor activities including diving, snorkeling, hiking, and Maya site exploration.</p>
                <p>Solo travelers benefit from increased transportation schedules, extended tour operations, and maximum accommodation options. However, advance booking becomes essential, and prices can double compared to low season rates. Popular destinations like Ambergris Caye and Placencia reach capacity during Christmas, New Year's, and Easter holidays.</p>

                <h3>Late Dry Season (March-May)</h3>
                <p>March through May offers the best balance of good weather and reasonable prices. Temperatures rise gradually, reaching peak heat in May, but rainfall remains minimal. This period provides excellent diving visibility, optimal hiking conditions, and comfortable beach weather without peak season crowds and costs.</p>
                <p>Solo travelers find this ideal for meeting other travelers while avoiding overwhelming crowds. Accommodation prices drop 20-30% compared to peak months, and tour operators offer more personalized attention with smaller group sizes.</p>

                <h2 id="section2">Wet Season: June to November</h2>
                
                <h3>Early Wet Season (June-August)</h3>
                <p>Despite the "wet season" designation, early summer months often provide excellent weather with afternoon thunderstorms clearing heat and humidity. Mornings typically feature clear skies perfect for outdoor activities, while brief afternoon showers provide welcome relief from tropical heat.</p>
                <p>This period offers significant advantages for budget-conscious solo travelers - accommodation costs drop 40-50%, restaurants offer low-season specials, and tour operators provide more flexible pricing. Wildlife activity increases with abundant water sources, making it ideal for nature enthusiasts.</p>

                <h3>Peak Wet Season (September-November)</h3>
                <p>September through November brings the heaviest rainfall and hurricane risk, making it the least popular tourist period. However, experienced solo travelers can find incredible value and unique experiences during these months. Rain typically falls in afternoon downpours rather than all-day drizzle, leaving mornings clear for activities.</p>
                <p>Hurricane season requires flexibility and travel insurance, but actual hurricane impacts are relatively rare. Many establishments close during October for maintenance, reducing accommodation and dining options but creating opportunities for authentic local experiences.</p>

                <h2 id="section3">Activity-Specific Timing</h2>
                
                <h3>Diving and Snorkeling</h3>
                <p>Optimal diving conditions occur during dry season (December-May) when visibility reaches 100+ feet and seas remain calm. However, wet season diving offers advantages including fewer crowds, discounted rates, and unique marine life behavior. Whale shark season peaks June-September, providing world-class encounters for patient divers.</p>
                <p>Solo travelers can easily join dive groups year-round, but advance booking becomes essential during dry season. Wet season offers more spontaneous opportunities and personalized instruction.</p>

                <h3>Wildlife Watching</h3>
                <p>Wildlife activity varies dramatically by season. Dry season concentrates animals around water sources, increasing sighting opportunities but potentially stressing wildlife. Wet season provides abundant food and water, leading to more natural animal behavior and better photography opportunities.</p>
                <p>Bird watching peaks during northern winter months (December-March) when migratory species arrive. Nesting season (April-June) offers unique behavioral observations but requires respectful distance from sensitive wildlife.</p>

                <h2 id="conclusion">Solo Traveler Recommendations</h2>
                <p>For first-time visitors prioritizing predictable weather and maximum activity options, plan visits during February-April when conditions are optimal and tourist infrastructure operates at full capacity. Budget-conscious travelers should consider June-August for significant savings with acceptable weather conditions.</p>
                <p>Adventure seekers and experienced travelers might prefer wet season visits (September-November) for authentic experiences, dramatic landscapes, and minimal crowds. Regardless of timing, solo travelers benefit from Belize's compact size and year-round warmth - any season offers incredible experiences for those prepared for local conditions.</p>
              `,
            },
          },
          components: {
            tableOfContents: 'Table of Contents',
            relatedPosts: 'Related Posts',
            relatedPostsComingSoon: 'Related posts coming soon...',
            stayUpdated: 'Stay Updated',
            stayUpdatedDescription: 'Get the latest travel tips and Belize guides delivered to your inbox.',
            enterEmail: 'Enter your email',
            subscribe: 'Subscribe',
            minRead: 'min read',
            views: 'views',
          },
          tags: {
            'Solo Travel': 'Solo Travel',
            'Adventure': 'Adventure',
            'Belize': 'Belize',
            'Travel Tips': 'Travel Tips',
            'Safety': 'Safety',
            'San Ignacio': 'San Ignacio',
            'Budget Travel': 'Budget Travel',
            'Luxury Travel': 'Luxury Travel',
            'Wildlife': 'Wildlife',
            'Nature': 'Nature',
            'Photography': 'Photography',
            'Money Saving': 'Money Saving',
            'Backpacking': 'Backpacking',
            'Travel Planning': 'Travel Planning',
            'Weather': 'Weather',
            'Seasons': 'Seasons',
          },
          categories: {
            'Safety': 'Safety',
            'Adventures': 'Adventures',
            'Destinations': 'Destinations',
            'Wildlife': 'Wildlife',
            'Budget Travel': 'Budget Travel',
            'Travel Planning': 'Travel Planning',
          },
          socialMedia: {
            facebookLabel: 'Follow us on Facebook',
            instagramLabel: 'Follow us on Instagram',
          },
        },
        adventureCards: {
          title: 'Featured Adventures',
          subtitle: 'Discover unique experiences designed for solo travelers and small groups',
          highlights: 'Highlights',
          viewAllAdventures: 'View All Adventures',
          adventures: {
            1: {
              title: 'Cave Tubing & Jungle Trek',
              description: 'Float through ancient underground cave systems and explore pristine jungle trails.',
              highlights: ['Ancient Maya caves', 'Jungle wildlife spotting', 'Professional guide', 'Equipment included'],
            },
            2: {
              title: 'Snorkeling at Hol Chan',
              description: 'Discover vibrant coral reefs and tropical marine life in Belize\'s premier marine reserve.',
              highlights: ['Hol Chan Marine Reserve', 'Shark Ray Alley', 'Colorful coral gardens', 'All gear provided'],
            },
            3: {
              title: 'Caracol Maya Ruins Adventure',
              description: 'Explore Belize\'s largest Maya archaeological site hidden deep in the jungle.',
              highlights: ['Ancient Maya temples', 'Jungle canopy views', 'Historical insights', 'Lunch included'],
            },
            4: {
              title: 'Blue Hole Diving Experience',
              description: 'Dive into the world-famous Blue Hole, a UNESCO World Heritage site.',
              highlights: ['UNESCO World Heritage', 'Unique geological formation', 'Expert dive guides', 'Certificate required'],
            },
            5: {
              title: 'Jungle Zip-lining & Waterfall',
              description: 'Soar through the jungle canopy and cool off in natural swimming holes.',
              highlights: ['Canopy zip-lining', 'Natural waterfalls', 'Swimming opportunities', 'Safety certified'],
            },
            6: {
              title: 'Manatee Watching & Beach Day',
              description: 'Gentle manatee encounters followed by relaxation on pristine beaches.',
              highlights: ['Manatee sanctuary visit', 'Pristine beaches', 'Beach lunch', 'Conservation focus'],
            },
            7: {
              title: 'Sunrise Fishing & Island Hopping',
              description: 'Start your day with sunrise fishing followed by snorkeling and exploring pristine cayes around Ambergris.',
              highlights: ['Early morning departure for best fishing', 'Snorkeling gear included', 'Fresh ceviche lunch on the boat'],
            },
            8: {
              title: 'Mountain Biking & Beach Day',
              description: 'Cycle through Garifuna villages and jungle trails, ending with relaxation on pristine Caribbean beaches.',
              highlights: ['Cultural village interactions', 'Mountain bike through jungle trails', 'Traditional Garifuna lunch included'],
            },
            9: {
              title: 'Night Jungle Safari',
              description: 'Experience the jungle come alive at night with guided tours through jaguar preserve territory.',
              highlights: ['Nocturnal wildlife spotting', 'Professional night vision equipment', 'Jaguar preserve exploration'],
            },
            10: {
              title: 'Cultural Village Tour & Chocolate Making',
              description: 'Visit authentic Maya villages and learn traditional chocolate-making techniques from cacao bean to bar.',
              highlights: ['Authentic Maya village experience', 'Traditional chocolate making workshop', 'Cultural exchange with local families'],
            },
          },
        },
        home: {
          hero: {
            title: 'Your Adventure Awaits',
            subtitle: 'What\'s your vibe? Search for an adventure or choose a popular experience.',
            searchPlaceholder: 'E.g., \'cave tubing\', \'jungle ruins\'',
            caveTubing: 'Cave Tubing',
            mayaRuins: 'Maya Ruins',
            snorkeling: 'Snorkeling',
          },
        },
        contact: {
          hero: {
            title: 'Let\'s Connect',
            subtitle: 'Questions about your Belize adventure? We\'re here to help with booking inquiries, safety concerns, and everything in between.',
            buttonText: 'Get In Touch',
          },
          info: {
            title: 'How to Reach Us',
            subtitle: 'We\'re based in beautiful Belize and ready to help plan your perfect adventure. Our local expertise ensures you get the most authentic experience possible.',
            belizeOffice: 'Belize Office',
            phone: 'Phone',
            email: 'Email',
            officeHours: 'Office Hours',
            address1: 'San Pedro, Ambergris Caye',
            address2: 'Belize, Central America',
            tollFree: 'Toll-Free: +1-800-XXX-XXXX',
            belizeLocal: 'Belize Local: +501-XXX-XXXX',
            emailGeneral: 'hello@belizevibes.com',
            emailBooking: 'booking@belizevibes.com',
            hoursWeekday: 'Monday - Friday: 8:00 AM - 6:00 PM (Belize Time)',
            hoursSaturday: 'Saturday: 9:00 AM - 4:00 PM',
            hoursSunday: 'Sunday: Closed',
          },
          map: {
            title: 'Interactive Map',
            subtitle: 'Google Maps integration coming soon',
          },
          form: {
            title: 'Send Us a Message',
            subtitle: 'Whether you\'re planning your first Belize adventure or have specific questions about safety and solo travel, we\'re here to help.',
            fullName: 'Full Name *',
            emailAddress: 'Email Address *',
            subject: 'Subject',
            message: 'Message *',
            fullNamePlaceholder: 'Enter your full name',
            emailPlaceholder: 'your.email@example.com',
            messagePlaceholder: 'Tell us about your Belize adventure plans, any questions you have, or how we can help...',
            sendMessage: 'Send Message',
            sendingMessage: 'Sending Message...',
            successMessage: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.',
          },
          subjects: {
            general: 'General Inquiry',
            booking: 'Booking Question',
            press: 'Press & Media',
            safety: 'Safety Concerns',
          },
        },
        safety: {
          hero: {
            title: 'Your Safety, Our Priority',
            subtitle: 'Everything you need to know to travel confidently in Belize.',
          },
          topics: {
            travelInsurance: {
              title: 'Travel Insurance',
              content: 'We strongly recommend comprehensive travel insurance covering medical emergencies, trip cancellation, and adventure activities. Many standard policies exclude cave tubing and diving—ensure your policy covers all planned activities.',
            },
            emergencyNumbers: {
              title: 'Local Emergency Numbers',
              content: 'Police: 911 or 90 • Fire/Ambulance: 911 • Tourist Police: 227-2222 • Our 24/7 Emergency Line: +501-XXX-XXXX. Save these numbers in your phone and keep a physical copy in your wallet.',
            },
            groupSupport: {
              title: 'Group Support for Solo Travelers',
              content: 'Never feel alone on your adventure. Our small group sizes (max 8 people) ensure personalized attention. Each group has certified guides with wilderness first aid training and satellite communication devices.',
            },
            localCustoms: {
              title: 'Respecting Local Customs',
              content: 'Belize is welcoming and diverse. Dress modestly when visiting villages or religious sites. Learn basic Creole greetings. Tip guides and service staff appropriately. Ask permission before photographing people.',
            },
            weatherAlerts: {
              title: 'Weather Alerts',
              content: 'Hurricane season runs June-November. Dry season (December-May) is ideal for most activities. We monitor weather constantly and will reschedule or modify trips for safety. Flash floods can occur during rainy season.',
            },
            healthWater: {
              title: 'Health and Water Safety',
              content: 'Tap water is generally safe in tourist areas, but bottled water is recommended. Bring insect repellent for jungle excursions. No special vaccinations required, but consult your doctor. Sunscreen is essential year-round.',
            },
          },
          sidebar: {
            emergencyContacts: 'Emergency Contacts',
            travelResources: 'Travel Resources',
            currentWeather: 'Current Weather: Clear',
            perfectConditions: 'Perfect conditions for adventures',
            belizeGovAlerts: 'Belize Government Travel Alerts',
            usStateDept: 'US State Department - Belize',
            weatherConditions: 'Current Weather Conditions',
          },
          contacts: {
            policeEmergency: 'Police Emergency',
            fireAmbulance: 'Fire/Ambulance',
            touristPolice: 'Tourist Police',
            belizeVibes24: 'BelizeVibes 24/7',
            usEmbassy: 'US Embassy Belize',
            karlHeusner: 'Karl Heusner Memorial Hospital',
          },
          cta: {
            title: 'Still Have Questions?',
            content: 'Our team is available 24/7 during your trip and happy to answer any safety concerns before you book.',
            button: 'Contact Us Anytime',
          },
        },
        about: {
          hero: {
            title: 'Our Story',
            subtitle: 'Meet the people behind Belize\'s boldest solo travel adventures.',
          },
          story: {
            title: 'Locally Owned. Globally Inspired.',
            content: 'BelizeVibes was founded by Dimitre Sleeuw and a group of young, certified, and passionate Belizeans. Our goal is to empower solo travelers to experience Belize authentically, safely, and sustainably. With deep roots in our culture and training in eco-tourism and hospitality, we offer more than just trips—we create meaningful connections.',
          },
          values: {
            authenticity: {
              title: 'Authenticity',
              description: 'Real Belizean experiences crafted by locals who know every hidden gem.',
            },
            safety: {
              title: 'Safety',
              description: 'Certified guides and comprehensive safety protocols for worry-free adventures.',
            },
            localExpertise: {
              title: 'Local Expertise',
              description: 'Born and raised in Belize, our team shares insider knowledge and cultural insights.',
            },
            sustainableTravel: {
              title: 'Sustainable Travel',
              description: 'Eco-certified practices that protect Belize\'s natural beauty for future generations.',
            },
          },
          team: {
            title: 'Meet Our Team',
            subtitle: 'Passionate locals dedicated to showing you the real Belize',
          },
          cta: {
            title: 'Want to Join Us?',
            content: 'We\'re always looking for passionate, certified guides who share our vision of sustainable, authentic travel experiences.',
            email: 'careers@belizevibes.com',
          },
        },
        adventureDetail: {
          loading: 'Loading...',
          notFound: {
            title: 'Adventure Not Found',
            returnHome: 'Return Home',
          },
          hero: {
            upTo: 'Up to',
          },
          overview: {
            title: 'Overview',
            reviews: 'reviews',
            highlights: 'Highlights',
            whatsIncluded: 'What\'s Included',
            whatToBring: 'What to Bring',
            notSuitableFor: 'Not Suitable For',
          },
          tabs: {
            reviews: 'Reviews',
            itinerary: 'Itinerary',
            faqs: 'FAQs',
          },
          reviews: {
            noReviews: 'No reviews yet. Be the first to share your experience!',
            verified: 'Verified',
          },
          placeholders: {
            itinerary: 'Detailed itinerary coming soon...',
            faqs: 'FAQs coming soon...',
          },
          pricing: {
            from: 'From',
            person: '/person',
            bookNow: 'Book Now',
            freeCancellation: 'Free cancellation up to 24 hours before',
          },
          quickDetails: {
            duration: 'Duration',
            groupSize: 'Group Size',
            difficulty: 'Difficulty',
            hours: 'hours',
          },
          safetyTrust: {
            title: 'Safety & Trust',
            licensedInsured: 'Licensed & Insured',
            safetyEquipment: 'Safety Equipment Provided',
            support24: '24/7 Support',
            satisfactionGuarantee: '100% Satisfaction Guarantee',
          },
          toast: {
            signInWishlist: 'Please sign in to save to wishlist',
            addedToWishlist: 'Added to wishlist',
            removedFromWishlist: 'Removed from wishlist',
            linkCopied: 'Link copied to clipboard',
            failedToLoad: 'Failed to load adventure details',
          },
          difficulties: {
            easy: 'Easy',
            moderate: 'Moderate',
            challenging: 'Challenging',
            extreme: 'Extreme',
          },
          socialProof: {
            title: 'Social Proof',
            recentBookings: 'Recent bookings',
            peopleViewing: 'People viewing',
            availability: 'Availability',
            thisWeek: 'this week',
            today: 'today',
            onlyXSpotsLeft: 'Only {{count}} spots left!',
            popularChoice: 'Popular Choice - {{count}}+ bookings',
            earlyBird: 'Early Bird: {{percent}}% off',
            lastBooked: 'Last booked: {{time}}',
            recentBookingsTitle: 'Recent Bookings',
            satisfactionRate: 'Satisfaction Rate',
            repeatCustomers: 'Repeat Customers',
            timeAgo: {
              justNow: 'Just now',
              hoursAgo: '{{hours}}h ago',
              yesterday: 'Yesterday',
              daysAgo: '{{days}}d ago',
            },
            mockTimes: {
              hoursAgo2: '2 hours ago',
              hoursAgo5: '5 hours ago',
              dayAgo1: '1 day ago',
              daysAgo2: '2 days ago',
              daysAgo3: '3 days ago',
            },
          },
        },
        booking: {
          stepIndicator: {
            stepXOfY: 'Step {{current}} of {{total}}',
            percentComplete: '{{percent}}% Complete',
          },
          steps: {
            titles: {
              dateTime: 'Date & Time',
              groupSize: 'Group Size',
              guestDetails: 'Guest Details',
              addOns: 'Add-ons',
              payment: 'Payment',
            },
            descriptions: {
              dateTime: 'Choose your adventure date',
              groupSize: 'Select number of participants',
              guestDetails: 'Your information',
              addOns: 'Enhance your experience',
              payment: 'Secure checkout',
            },
            stepXOfY: 'Step {{current}} of {{total}}',
          },
          step2: {
            headers: {
              howManyPeople: 'How Many People?',
              priceBreakdown: 'Price Breakdown',
              availableDiscounts: 'Available Discounts',
              capacityInformation: 'Capacity Information',
            },
            labels: {
              participant: 'Participant',
              participants: 'Participants',
              solo: 'Solo',
              couple: 'Couple',
              group: 'Group',
              total: 'Total',
              spots: 'spots',
            },
            messages: {
              onlyXSpotsLeft: 'Only {{count}} spots left for this date!',
              soloTravelerFriendly: 'Solo Traveler Friendly',
              soloDescription: 'This adventure is perfect for solo travelers. You\'ll join a small group of like-minded adventurers!',
              groupBenefits: 'Group Benefits',
              groupDescription: 'Great choice for groups! You\'ll get a discount and can enjoy a more personalized experience.',
            },
            pricing: {
              participantCount: '${{price}} × {{count}} participant',
              participantCountPlural: '${{price}} × {{count}} participants',
              groupDiscount: 'Group discount ({{percent}}% off)',
              earlyBirdDiscount: 'Early bird discount',
              taxesAndFees: 'Taxes & fees',
            },
            capacity: {
              maxGroupSize: 'Maximum group size:',
              availableSpots: 'Available spots for this date:',
              yourSelection: 'Your selection:',
            },
            discountTypes: {
              groupDiscount: 'Group Discount',
              earlyBird: 'Early Bird',
            },
            discountDescriptions: {
              groupDiscountDesc: '{{percent}}% off for groups of 4+',
              earlyBirdDesc: '{{percent}}% off when booking {{days}} days ahead',
            },
          },
          labels: {
            selectDate: 'Select Date',
            selectTime: 'Select Time',
            numberOfParticipants: 'Number of Participants',
            pricingBreakdown: 'Pricing Breakdown',
          },
          placeholders: {
            pickDate: 'Pick a date',
            chooseTime: 'Choose a time',
            enterPromoCode: 'Enter promo code',
          },
          buttons: {
            havePromoCode: 'Have a promo code?',
            apply: 'Apply',
            bookNow: 'Book Now',
          },
          messages: {
            wontBeChargedYet: 'You won\'t be charged yet',
            freeCancellation: 'Free cancellation up to 24 hours before',
            fullRefund: 'Get a full refund if you cancel at least 24 hours in advance.',
          },
          step1: {
            selectDate: 'Select Your Date',
            chooseTime: 'Choose Your Time',
            importantInfo: 'Important Information',
            weatherForecast: 'Weather Forecast',
            selectDateToCheck: 'Select a date to check availability',
            timeSlots: {
              morningDeparture: 'Morning departure',
              afternoonDeparture: 'Afternoon departure',
              lateAfternoonDeparture: 'Late afternoon departure',
            },
            availability: {
              checkingAvailability: 'Checking availability...',
              fullyBooked: 'Fully booked',
              onlyXSpotsLeft: 'Only {{count}} spots left',
              xSpotsAvailable: '{{count}} spots available',
            },
            weather: {
              partlyCloudy: 'Partly cloudy',
              chanceOfRain: '{{percent}}% chance of rain',
            },
            info: {
              bookingWindow: 'Booking Window:',
              bookingWindowDesc: 'Book at least 24 hours in advance, up to {{days}} days ahead',
              freeCancellation: 'Free Cancellation:',
              freeCancellationDesc: 'Cancel up to 24 hours before your adventure for a full refund',
              groupSize: 'Group Size:',
              groupSizeDesc: 'Maximum {{count}} participants per session',
              meetingPoint: 'Meeting Point:',
              meetingPointFallback: 'Details will be provided after booking',
            },
            earlyBird: {
              title: 'Early Bird Special: {{percent}}% Off!',
              description: 'Book {{days}} days in advance and save on your adventure',
            },
            duration: {
              hours: '{{count}} hours',
            },
          },
          step3: {
            headers: {
              leadGuestInformation: 'Lead Guest Information',
              experienceLevel: 'Experience Level',
              dietaryRestrictions: 'Dietary Restrictions & Allergies',
              emergencyContact: 'Emergency Contact',
              communicationPreferences: 'Communication Preferences',
              adventureRequirements: 'Adventure Requirements',
              privacySecurity: 'Privacy & Security',
            },
            descriptions: {
              leadGuest: 'This person will be the main contact for this booking',
              experienceLevel: 'Help us provide the best experience for your skill level',
              dietary: 'Let us know about any dietary needs or allergies',
              emergencyContact: 'Someone we can contact in case of emergency',
              communications: 'How would you like to receive updates about your booking?',
            },
            labels: {
              fullName: 'Full Name *',
              phoneNumber: 'Phone Number *',
              emailAddress: 'Email Address *',
              pleaseSpecify: 'Please specify',
            },
            placeholders: {
              enterFullName: 'Enter your full name',
              phoneFormat: '+1 (555) 123-4567',
              emailFormat: 'your@email.com',
              emergencyContactName: 'Emergency contact name',
              dietaryNeeds: 'Please describe your dietary needs',
            },
            experienceLevels: {
              beginner: {
                label: 'Beginner',
                description: 'First time or very limited experience',
              },
              intermediate: {
                label: 'Intermediate', 
                description: 'Some experience with similar activities',
              },
              advanced: {
                label: 'Advanced',
                description: 'Extensive experience and confident',
              },
              expert: {
                label: 'Expert',
                description: 'Professional level or extensive experience',
              },
            },
            dietary: {
              vegetarian: 'Vegetarian',
              vegan: 'Vegan',
              glutenFree: 'Gluten-free',
              dairyFree: 'Dairy-free',
              nutAllergy: 'Nut allergy',
              shellfishAllergy: 'Shellfish allergy',
              other: 'Other',
            },
            notifications: {
              email: 'Email notifications',
              sms: 'SMS notifications',
              whatsapp: 'WhatsApp notifications',
            },
            messages: {
              emailConfirmation: 'We\'ll send booking confirmations and updates to this email',
            },
            privacy: {
              secureDataProcessing: 'Secure Data Processing:',
              secureDataDesc: 'All personal information is encrypted and stored securely',
              limitedDataUse: 'Limited Data Use:',
              limitedDataDesc: 'Information used only for booking processing and customer support',
              noSpamPolicy: 'No Spam Policy:',
              noSpamDesc: 'We\'ll only contact you about your booking unless you opt-in',
              privacyCompliant: 'Privacy Compliant:',
              privacyCompliantDesc: 'Full compliance with Privacy Policy and Terms of Service',
            },
          },
          step4: {
            headers: {
              enhanceAdventure: 'Enhance Your Adventure',
              promoCode: 'Promo Code',
              specialRequests: 'Special Requests',
              popularCombinations: 'Popular Combinations',
            },
            descriptions: {
              enhanceAdventure: 'Add optional extras to make your experience even more memorable',
              specialRequests: 'Let us know if you have any special requests or additional information',
              popularCombinations: 'Save money with these popular bundle packages',
            },
            addOns: {
              photos: {
                name: 'Professional Photos',
                description: 'Get high-quality photos of your adventure taken by our professional photographer',
                category: 'Photography',
              },
              lunch: {
                name: 'Gourmet Lunch',
                description: 'Enjoy a delicious locally-sourced lunch with vegetarian options available',
                category: 'Food & Drink',
              },
              transport: {
                name: 'Hotel Pickup',
                description: 'Convenient pickup and drop-off from your hotel in the main tourist areas',
                category: 'Transportation',
              },
              gear: {
                name: 'Premium Gear Upgrade',
                description: 'Upgrade to premium adventure gear for enhanced comfort and safety',
                category: 'Equipment',
              },
              souvenir: {
                name: 'Adventure Souvenir Pack',
                description: 'Take home a branded t-shirt, water bottle, and photo album',
                category: 'Souvenirs',
              },
            },
            combos: {
              memory: {
                name: 'Memory Package',
                description: 'Professional Photos + Souvenir Pack = ${{bundlePrice}} (Save ${{savings}}!)',
                badge: 'Most popular choice for first-time visitors',
              },
              comfort: {
                name: 'Comfort Package',
                description: 'Hotel Pickup + Gourmet Lunch = ${{bundlePrice}} (Save ${{savings}}!)',
                badge: 'Perfect for a hassle-free experience',
              },
            },
            labels: {
              popular: 'Popular',
              selectedAddOns: 'Selected Add-ons',
              addOnsTotal: 'Add-ons Total',
              selected: 'Selected',
              additionalInfo: 'Additional Information (Optional)',
            },
            placeholders: {
              promoCode: 'Enter promo code',
              specialRequests: 'e.g., celebrating a special occasion, mobility considerations, specific dietary needs not mentioned earlier...',
            },
            buttons: {
              apply: 'Apply',
              checking: 'Checking...',
            },
            messages: {
              enterPromoCode: 'Please enter a promo code',
              promoSuccess: 'Promo code applied successfully!',
              promoInvalid: 'Invalid or expired promo code',
              promoApplied: 'Promo code "{{code}}" applied!',
              comboRemoved: '{{name}} removed',
              comboSelectedWithReplace: '{{name}} selected! Replaced individual items: {{items}}. You save ${{savings}}!',
              comboAdded: '{{name}} added! You save ${{savings}}!',
              accommodateRequests: 'We\'ll do our best to accommodate your requests, though some may not be possible depending on availability.',
            },
          },
          step5: {
            headers: {
              bookingSummary: 'Booking Summary',
              priceBreakdown: 'Price Breakdown',
              paymentMethod: 'Payment Method',
              paymentPlanDetails: 'Payment Plan Details',
              securityTrust: 'Security & Trust',
            },
            labels: {
              leadGuest: 'Lead Guest',
              addons: 'Add-ons',
              participant: 'participant',
              participants: 'participants',
              popular: 'Popular',
              today: 'Today',
              in1Month: 'In 1 month',
              in2Months: 'In 2 months',
            },
            paymentMethods: {
              card: {
                name: 'Credit or Debit Card',
                description: 'Visa, Mastercard, American Express',
              },
              applePay: {
                name: 'Apple Pay',
                description: 'Quick and secure payment',
              },
              googlePay: {
                name: 'Google Pay',
                description: 'Pay with your Google account',
              },
              paymentPlan: {
                name: 'Payment Plan',
                description: 'Pay in 3 monthly installments',
              },
            },
            pricing: {
              groupDiscount: 'Group discount',
              earlyBirdDiscount: 'Early bird discount',
              promoDiscount: 'Promo discount',
              addons: 'Add-ons',
              taxesFees: 'Taxes & fees',
              total: 'Total',
            },
            paymentPlan: {
              noInterestDescription: 'No interest charges. Automatic payments from your selected payment method.',
            },
            security: {
              sslEncrypted: 'SSL encrypted secure payment',
              pciCompliant: 'PCI DSS compliant processing',
              instantConfirmation: 'Instant booking confirmation',
              freeCancellation: 'Free cancellation up to 24 hours',
            },
            terms: {
              agreementText: 'I agree to the',
              termsOfService: 'Terms of Service',
              privacyPolicy: 'Privacy Policy',
              cancellationPolicy: 'Cancellation Policy',
              and: 'and',
              comma: ',',
              bookingSubjectText: '. I understand that this booking is subject to availability and confirmation.',
            },
            confirmation: {
              emailConfirmation: '• You will receive a confirmation email with booking details and QR code',
              teamContact: '• Our team will contact you 24 hours before your adventure with final details',
              freeCancellation: '• Free cancellation up to 24 hours before your scheduled adventure',
            },
            buttons: {
              processingBooking: 'Processing your booking...',
              completeBooking: 'Complete Booking',
            },
            messages: {
              redirectMessage: 'You will be redirected to our secure payment processor',
            },
          },
        }
      },
      'fr-CA': {
        navigation: {
          home: 'Accueil',
          adventures: 'Aventures',
          reviews: 'Avis',
          about: 'À Propos',
          blog: 'Blog',
          safety: 'Sécurité',
          contact: 'Contact',
        },
        common: {
          signIn: 'Se Connecter',
          signUp: 'S\'Inscrire',
          bookNow: 'Réserver',
          learnMore: 'En Savoir Plus',
        },
        hero: {
          title_part1: 'Découvrez Votre Ultime',
          title_part2: 'Aventure au Belize',
          subtitle: 'Rejoignez des aventures solo-friendly à travers des jungles pristines, des grottes anciennes et des eaux cristallines. Guides experts, voyage durable, souvenirs inoubliables.',
          rating: 'Note 4.9/5',
          reviews: '500+ Avis',
          soloFriendly: 'Solo-Friendly',
          smallGroups: 'Petits Groupes',
          fullyInsured: 'Entièrement Assuré',
          atolProtected: 'Protection ATOL',
          sustainable: 'Durable',
          ecoCertified: 'Éco-Certifié',
          bookNowPrice: 'Réserver - $',
          loadingTours: 'Chargement des Tours...',
          featuredAdventure: 'Aventure Vedette:',
        },
        footer: {
          company: {
            description: 'Votre partenaire de confiance pour des aventures inoubliables au Belize. Spécialisés dans des expériences de voyage durables et accueillantes pour les voyageurs solo qui vous connectent à la nature et à la culture.',
          },
          sections: {
            quickLinks: 'Liens Rapides',
            popularAdventures: 'Aventures Populaires',
            contactUs: 'Nous Contacter',
            certified: 'Nous Sommes Certifiés',
          },
          quickLinks: {
            adventures: 'Aventures',
            aboutUs: 'À Propos',
            reviews: 'Avis',
            soloTravelGuide: 'Guide Voyage Solo',
            safetyInformation: 'Informations Sécurité',
            faq: 'FAQ',
          },
          adventures: {
            caveTubing: 'Tubing en Grotte',
            blueHoleDiving: 'Plongée Blue Hole',
            mayaRuinsTours: 'Tours Ruines Mayas',
            snorkelingTours: 'Tours de Plongée',
            jungleZiplining: 'Tyrolienne Jungle',
            wildlifeWatching: 'Observation Faune',
          },
          contact: {
            address1: 'San Pedro, Ambergris Caye',
            address2: 'Belize, Amérique Centrale',
            phone: '+501-XXX-XXXX',
            email: 'hello@belizevibes.com',
          },
          legal: {
            copyright: '© 2024 BelizeVibes. Tous droits réservés.',
            privacyPolicy: 'Politique Confidentialité',
            termsOfService: 'Conditions de Service',
            cookiePolicy: 'Politique Cookies',
          },
        },
        auth: {
          titles: {
            welcomeBack: 'Bon Retour!',
            joinBelizeVibes: 'Rejoignez BelizeVibes',
            resetPassword: 'Réinitialiser Mot de Passe',
          },
          subtitles: {
            signIn: 'Connectez-vous pour réserver votre prochaine aventure',
            signUp: 'Commencez votre voyage d\'aventure aujourd\'hui',
            reset: 'Nous vous enverrons un lien pour réinitialiser votre mot de passe',
          },
          buttons: {
            continueWithGoogle: 'Continuer avec Google',
            continueWithApple: 'Continuer avec Apple',
            continueWithInstagram: 'Continuer avec Instagram',
            preferred: 'Préféré',
            signIn: 'Se Connecter',
            signUp: 'Créer un Compte',
            sendResetEmail: 'Envoyer Email Reset',
            signingIn: 'Connexion...',
            creatingAccount: 'Création du compte...',
            sendingEmail: 'Envoi de l\'email...',
            createAccount: 'Créer un compte',
            forgotPassword: 'Mot de passe oublié?',
          },
          labels: {
            firstName: 'Prénom',
            lastName: 'Nom',
            accountType: 'Type de Compte',
            email: 'Email',
            password: 'Mot de Passe',
            confirmPassword: 'Confirmer Mot de Passe',
            rememberMe: 'Se souvenir de moi',
            agreeToTerms: 'J\'accepte les',
            termsOfService: 'Conditions de Service',
            privacyPolicy: 'Politique de Confidentialité',
            and: 'et',
          },
          placeholders: {
            selectRole: 'Sélectionnez votre rôle',
            enterEmail: 'Entrez votre email',
            enterPassword: 'Entrez votre mot de passe',
            confirmPassword: 'Confirmez votre mot de passe',
          },
          roles: {
            traveler: 'Voyageur',
            guide: 'Guide Touristique',
            admin: 'Administrateur',
          },
          separators: {
            orContinueWithEmail: 'Ou continuer avec email',
          },
          footer: {
            newToBelizeVibes: 'Nouveau sur BelizeVibes?',
            alreadyHaveAccount: 'Vous avez déjà un compte?',
            rememberPassword: 'Vous vous souvenez de votre mot de passe?',
            signInLink: 'Se connecter',
          },
          validation: {
            emailRequired: 'Email requis',
            validEmailRequired: 'Veuillez entrer une adresse email valide',
            passwordRequired: 'Mot de passe requis',
            passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
            passwordUppercase: 'Le mot de passe doit contenir une lettre majuscule',
            passwordLowercase: 'Le mot de passe doit contenir une lettre minuscule',
            passwordNumber: 'Le mot de passe doit contenir un chiffre',
            passwordSpecialChar: 'Le mot de passe doit contenir un caractère spécial',
          },
          messages: {
            passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
            acceptTerms: 'Veuillez accepter les conditions d\'utilisation',
            invalidCredentials: 'Email ou mot de passe invalide',
            emailNotConfirmed: 'Veuillez vérifier votre email et cliquer sur le lien de confirmation',
            signInSuccess: 'Connexion réussie!',
            accountCreated: 'Compte créé! Vérifiez votre email pour la vérification, puis connectez-vous pour accéder à votre tableau de bord.',
            resetEmailSent: 'Email de réinitialisation envoyé! Vérifiez votre boîte de réception.',
            oauthFailed: 'Échec de la connexion avec',
            oauthRedirecting: 'Redirection vers',
            unexpectedError: 'Une erreur inattendue s\'est produite',
          },
        },
        testimonials: {
          header: 'Ce Que Disent les Voyageurs Solo',
          subtitle: 'Ne nous croyez pas sur parole. Voici ce que nos aventuriers voyageurs solo ont à dire sur leurs expériences BelizeVibes.',
          buttons: {
            writeReview: 'Écrire un Avis',
            hideForm: 'Masquer le Formulaire',
            submitReview: 'Soumettre l\'Avis',
            cancel: 'Annuler',
            loadMore: 'Voir Plus d\'Avis ({{count}} de plus)',
            loading: 'Chargement...',
          },
          form: {
            title: 'Partagez Votre Expérience BelizeVibes',
            labels: {
              name: 'Votre Nom *',
              rating: 'Évaluation *',
              review: 'Votre Avis *',
              photos: 'Ajouter des Photos (Optionnel) - Jusqu\'à {{max}} images',
            },
            placeholders: {
              name: 'Entrez votre nom',
              review: 'Parlez-nous de votre expérience avec BelizeVibes...',
            },
            upload: {
              clickToUpload: 'Cliquez pour télécharger des photos ou glissez-déposez',
              maxReached: 'Maximum {{max}} images sélectionnées',
              fileTypes: 'PNG, JPG, GIF jusqu\'à 5MB chacune',
              uploading: 'Téléchargement des images...',
              selectedImages: 'Images Sélectionnées ({{count}}/{{max}})',
            },
            validation: {
              nameRequired: 'Le nom est requis',
              contentRequired: 'Le contenu de l\'avis est requis',
              contentMinLength: 'L\'avis doit contenir au moins 10 caractères',
              ratingRequired: 'Veuillez sélectionner une évaluation',
              maxImages: 'Maximum {{max}} images autorisées',
              oversizedFiles: 'Certaines images sont trop volumineuses (max 5MB par image)',
              invalidFiles: 'Vous ne pouvez télécharger que jusqu\'à {{max}} images',
              notImage: '{{filename}} n\'est pas une image',
              tooLarge: '{{filename}} est trop volumineuse (max 5MB)',
            },
            messages: {
              submitting: 'Envoi en cours...',
              uploadingImages: 'Téléchargement des Images...',
              success: 'Merci pour votre avis! Il sera publié après vérification.',
              error: 'Échec de l\'envoi de l\'avis. Veuillez réessayer.',
              uploadError: 'Échec du téléchargement des images',
            },
          },
          stats: {
            averageRating: 'Évaluation Moyenne',
            totalReviews: 'Total des Avis',
            soloTravelers: 'Voyageurs Solo',
            satisfaction: 'Satisfaction',
          },
          accessibility: {
            rateStar: 'Évaluer {{star}} étoile{{plural}}',
            reviewPhoto: 'Photo d\'avis {{index}} par {{name}}',
            photosCount: '{{count}} photo{{plural}} • Cliquez pour voir en taille réelle',
            previewImage: 'Aperçu {{index}}',
          },
        },
        blog: {
          hero: {
            title: 'Guide de Voyage Solo',
            subtitle: 'Conseils, histoires et inspiration pour votre voyage au Belize.',
            startReading: 'Commencer à Lire',
          },
          main: {
            latestStories: 'Dernières Histoires',
            readMore: 'Lire Plus',
          },
          sidebar: {
            popularTopics: 'Sujets Populaires',
            followUs: 'Suivez-Nous',
            stayUpdated: 'Restez Informé',
            newsletterDescription: 'Recevez les derniers conseils de voyage et histoires d\'aventure directement dans votre boîte de réception.',
            emailPlaceholder: 'Entrez votre email',
            subscribe: 'S\'Abonner',
          },
          topics: {
            wildlife: 'Faune',
            safety: 'Sécurité',
            budgetTravel: 'Voyage Économique',
            groupTours: 'Tours de Groupe',
            jungleAdventures: 'Aventures Jungle',
            beachActivities: 'Activités Plage',
            culturalExperiences: 'Expériences Culturelles',
            soloTips: 'Conseils Solo',
            photography: 'Photographie',
          },
          posts: {
            post1: {
              title: '10 Aventures Solo à Faire au Belize',
              excerpt: 'Du tubing en grotte à la tyrolienne en jungle, découvrez les meilleures aventures solo-friendly que le Belize a à offrir.',
              metaDescription: 'Découvrez les 10 meilleures aventures solo au Belize incluant tubing en grotte, tyrolienne jungle, exploration ruines mayas et plus. Guide complet voyageurs solo.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Le Belize est un paradis pour les voyageurs solo, offrant une diversité incroyable d'aventures qui s'adressent parfaitement aux explorateurs indépendants. Dès l'instant où vous descendez de l'avion, vous découvrirez un pays qui accueille les aventuriers solo à bras ouverts et offre des expériences qui créeront des souvenirs pour toute une vie.</p>
                
                <p>Ce joyau d'Amérique centrale possède la deuxième plus grande barrière de corail au monde, d'anciennes ruines mayas cachées au fond des canopées jungle, et une culture qui mélange harmonieusement les influences caribéennes, latines et indigènes. Ce qui rend le Belize particulièrement spécial pour les voyageurs solo est sa population anglophone, sa taille relativement petite, et son infrastructure touristique bien développée qui rend la navigation facile et sûre.</p>

                <h2 id="section1">Les Aventures Solo Ultimes</h2>
                
                <h3>1. Tubing en Grotte dans la Rivière Caves Branch</h3>
                <p>L'une des aventures les plus emblématiques du Belize, le tubing en grotte offre un mélange unique de détente et d'excitation. Alors que vous flottez à travers d'anciennes grottes calcaires sur une chambre à air, vous vous émerveillerez devant les stalactites et stalagmites formées sur des millions d'années. L'expérience dure généralement 3-4 heures et inclut une randonnée modérée à travers la forêt tropicale pour atteindre l'entrée de la grotte.</p>
                <p>Ce qui rend cette activité parfaite pour les voyageurs solo est la nature de groupe de l'activité - vous créerez rapidement des liens avec vos compagnons d'aventure tandis que des guides expérimentés assurent la sécurité de tous. Les grottes maintiennent une température constante d'environ 24°C, offrant une pause rafraîchissante de la chaleur tropicale du Belize.</p>

                <h3>2. Exploration des Ruines Mayas de Caracol</h3>
                <p>Au fond de la Réserve Forestière Chiquibul se trouve Caracol, le plus grand site archéologique maya du Belize. Cette ancienne cité abritait autrefois plus de 100 000 personnes et présente la plus haute structure artificielle du Belize - la pyramide Canaa de 43 mètres. Le voyage vers Caracol est une aventure en soi, nécessitant un trajet de 2,5 heures sur des routes de jungle où vous pourriez apercevoir jaguars, pumas et plus de 300 espèces d'oiseaux.</p>
                <p>Les voyageurs solo apprécient particulièrement la solitude spirituelle trouvée sur ce site reculé. Contrairement aux ruines plus fréquentées, Caracol offre la chance d'explorer largement sans perturbation, grimpant des pyramides et errant dans les places avec seulement les sons des singes hurleurs et oiseaux tropicaux pour compagnie.</p>

                <h3>3. Plongée dans le Blue Hole</h3>
                <p>Le Blue Hole, un gouffre marin de 120 mètres de profondeur, représente le Saint Graal des expériences de plongée. Ce site du patrimoine mondial UNESCO offre des rencontres avec requins de récif, mérous géants et formations géologiques uniques. Bien qu'une certification avancée soit requise, l'expérience de descendre dans cette merveille naturelle est inégalée.</p>
                <p>Pour les voyageurs solo, rejoindre un groupe de plongée crée des amitiés instantanées avec des passionnés sous-marins du monde entier. L'expérience partagée de témoin de l'un des phénomènes naturels les plus remarquables de la Terre crée des liens qui durent souvent bien au-delà du voyage.</p>

                <h3>4. Aventures Tyrolienne en Jungle</h3>
                <p>Planer à travers la canopée de la forêt tropicale offre une vue d'oiseau de l'incroyable biodiversité du Belize. Plusieurs parcours de tyrolienne à travers le pays offrent différents niveaux de difficulté, des glissades douces adaptées aux débutants aux descentes palpitantes pour les chercheurs d'adrénaline.</p>
                <p>La région Mountain Pine Ridge offre une tyrolienne particulièrement spectaculaire, avec des lignes s'étendant au-dessus des cascades et offrant des vues panoramiques de la jungle en contrebas. Les voyageurs solo adorent la camaraderie immédiate qui se développe dans les groupes de tyrolienne alors que chacun encourage les autres à faire le saut.</p>

                <h3>5. Plongée avec Tuba à la Réserve Marine Hol Chan</h3>
                <p>Située juste au large d'Ambergris Caye, la Réserve Marine Hol Chan offre certaines des meilleures expériences de plongée avec tuba des Caraïbes. Les eaux protégées de la réserve grouillent de poissons tropicaux, raies et requins-nourrices. Le célèbre "Shark Ray Alley" offre l'expérience palpitante de nager aux côtés de ces géants doux dans leur habitat naturel.</p>
                <p>Ce qui rend cela idéal pour les voyageurs solo est la facilité de rejoindre des excursions d'une journée depuis San Pedro. Les expériences partagées en bateau et les rencontres sous-marines créent des sujets de conversation naturels et mènent souvent à des amitiés durables avec d'autres voyageurs.</p>

                <h2 id="section2">Planifier Votre Aventure Solo</h2>
                
                <h3>Meilleur Moment pour Visiter</h3>
                <p>Le Belize jouit d'un climat tropical avec deux saisons distinctes. La saison sèche (décembre à mai) offre le temps le plus prévisible et est idéale pour la plupart des activités extérieures. Cependant, c'est aussi la haute saison touristique, signifiant des prix plus élevés et plus de foules aux destinations populaires.</p>
                <p>La saison des pluies (juin à novembre) apporte des prix plus bas et moins de touristes, mais aussi la possibilité d'averses l'après-midi et la saison des ouragans (particulièrement août à octobre). Beaucoup de voyageurs solo préfèrent les mois d'épaule de novembre et mai, qui offrent un bon équilibre entre temps et valeur.</p>

                <h3>Transport et Logistique</h3>
                <p>La taille compacte du Belize le rend parfait pour l'exploration solo. Le pays s'étend seulement 467 kilomètres du nord au sud et 177 kilomètres d'est en ouest. Les vols domestiques connectent les destinations principales en moins d'une heure, tandis que les services de bus offrent des options de voyage terrestre économiques.</p>
                <p>Pour une flexibilité maximale, beaucoup de voyageurs solo louent des voitures pour l'exploration continentale, tandis que les voiturettes de golf sont le mode de transport préféré sur les cayes. Les taxis aquatiques connectent efficacement le continent aux destinations insulaires comme Ambergris Caye et Caye Caulker.</p>

                <h2 id="conclusion">Conclusion</h2>
                <p>Le Belize offre une combinaison inégalée d'aventure, culture et beauté naturelle qui en fait une destination idéale pour les voyageurs solo. Que vous cherchiez des aventures palpitantes ou des moments paisibles dans la nature, ce pays remarquable offre des expériences qui vous défieront, vous inspireront et vous rajeunireront.</p>
                <p>La clé d'une aventure solo réussie au Belize est d'embrasser l'inattendu, rester ouvert aux nouvelles expériences, et se connecter avec les gens chaleureux et accueillants qui appellent ce paradis leur maison. Emballez votre sens de l'aventure, et préparez-vous pour le voyage d'une vie dans le magnifique Belize.</p>
              `,
            },
            post2: {
              title: 'Comment Rester en Sécurité en Voyageant Seul',
              excerpt: 'Conseils de sécurité essentiels et précautions pour les voyageurs solo explorant les magnifiques paysages du Belize.',
              metaDescription: 'Guide sécurité essentiel pour voyageurs solo au Belize. Apprenez sécurité personnelle, précautions santé, contacts urgence et conseils assurance voyage.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Le voyage solo au Belize peut être l'une des expériences les plus enrichissantes de votre vie, offrant liberté, découverte de soi et aventures incroyables. Cependant, voyager seul nécessite aussi une attention supplémentaire à la sécurité et la préparation. Ce guide complet vous équipera des connaissances essentielles pour explorer le Belize avec confiance et sécurité.</p>
                
                <p>Le Belize est généralement considéré comme l'une des destinations d'Amérique centrale les plus sûres pour les voyageurs solo, particulièrement dans les zones touristiques. La population anglophone du pays, sa démocratie stable et son infrastructure touristique bien développée contribuent à un environnement relativement sûr. Cependant, comme toute destination internationale, être préparé et conscient est crucial pour une aventure solo réussie.</p>

                <h2 id="section1">Préparation Pré-Voyage</h2>
                
                <h3>Recherche et Planification</h3>
                <p>Une recherche approfondie forme la fondation du voyage solo sécuritaire. Avant le départ, familiarisez-vous avec les situations politiques actuelles, les patterns météo et tout avis de voyage émis par votre gouvernement. Le Département d'État américain, le Foreign Office britannique et agences similaires fournissent des informations pays à jour et évaluations de sécurité.</p>
                <p>Créez des itinéraires détaillés incluant adresses d'hébergement, horaires de transport et réservations d'activités. Partagez ceux-ci avec des contacts de confiance à la maison, établissant des horaires de check-in réguliers. Cela crée un filet de sécurité assurant que quelqu'un connaît votre localisation en tout temps.</p>

                <h3>Préparations Santé</h3>
                <p>Visitez une clinique de médecine de voyage au moins 4-6 semaines avant le départ. Le Belize ne requiert aucune vaccination pour l'entrée, mais les médecins recommandent typiquement hépatite A et B, typhoïde, et vaccinations de routine incluant rougeole, oreillons, rubéole et influenza. Considérez la prophylaxie malaria si vous voyagez dans des zones rurales, particulièrement pendant la saison des pluies.</p>
                <p>Emballez une trousse de premiers soins complète incluant médicaments de prescription (dans contenants originaux), bandages de base, lingettes antiseptiques, analgésiques, médicament anti-diarrhéique et toute nécessité médicale personnelle. Incluez copies de prescriptions et cartes d'assurance médicale.</p>

                <h3>Assurance Voyage</h3>
                <p>L'assurance voyage complète est non-négociable pour les voyageurs solo. Assurez-vous que la couverture inclut évacuation médicale d'urgence, annulation de voyage, bagages perdus et activités d'aventure comme plongée ou tyrolienne. Beaucoup de polices standards excluent les "sports d'aventure", donc vérifiez la couverture pour les activités planifiées.</p>
                <p>Recherchez les installations médicales dans vos zones de destination. Belize City et San Pedro ont les installations médicales les plus avancées, tandis que les zones reculées peuvent nécessiter évacuation pour blessures ou maladies sérieuses.</p>

                <h2 id="section2">Stratégies de Sécurité sur Place</h2>
                
                <h3>Sécurité Hébergement</h3>
                <p>Choisissez soigneusement les hébergements, priorisant la sécurité sur les économies. Recherchez des propriétés avec service de réception 24 heures, entrées sécurisées, coffres-forts dans les chambres et avis récents positifs de voyageurs solo. Les hôtels de gamme moyenne et auberges établies offrent typiquement le meilleur ratio sécurité-valeur.</p>
                <p>À l'arrivée, notez les sorties d'urgence, gardez les chambres verrouillées en tout temps et utilisez les coffres-forts fournis pour passeports, excès d'argent et électroniques. Évitez d'afficher les numéros de chambre publiquement et soyez discret en entrant votre chambre.</p>

                <h3>Sécurité Transport</h3>
                <p>Utilisez des services de transport réputés chaque fois que possible. Pour les vols domestiques, Maya Island Air et Tropic Air maintiennent d'excellents records de sécurité. Lors de l'utilisation de taxis, choisissez des compagnies établies ou demandez aux hébergements d'arranger le transport. Évitez de héler des véhicules aléatoires dans les rues.</p>
                <p>Si vous louez une voiture, inspectez minutieusement le véhicule, assurez une couverture d'assurance appropriée et évitez de conduire la nuit à l'extérieur des villes principales. Gardez les portes verrouillées et fenêtres partiellement fermées en conduisant, et ne laissez jamais d'objets de valeur visibles dans les voitures stationnées.</p>

                <h3>Mesures de Sécurité Personnelle</h3>
                <p>Maintenez des profils bas en s'habillant conservativement et évitant bijoux voyants ou électroniques coûteux en public. Portez un minimum d'argent et cartes, laissant les extras sécurisés aux hébergements. Distribuez l'argent à travers plusieurs emplacements incluant poches cachées, coffres d'hôtel et réserves d'urgence.</p>
                <p>Faites confiance à vos instincts - si les situations semblent inconfortables, retirez-vous immédiatement. Évitez de marcher seul après la tombée de la nuit, particulièrement à Belize City et autres zones urbaines. Restez dans des zones bien éclairées et peuplées quand possible.</p>

                <h2 id="conclusion">Préparation d'Urgence et Contacts</h2>
                
                <h3>Numéros Importants</h3>
                <p>Urgence Police: 911<br>
                Police Touristique: 227-2222<br>
                Pompiers: 911<br>
                Urgence Médicale: 911<br>
                Votre Ambassade/Consulat (stockez dans téléphone)</p>

                <h3>Stratégies de Communication</h3>
                <p>Maintenez plusieurs méthodes de communication incluant plans téléphoniques internationaux, cartes SIM locales et apps d'appel WiFi. Informez les contacts des horaires de communication et ayez des plans de secours si les méthodes primaires échouent. Considérez des communicateurs satellite pour voyage en zone reculée.</p>
                <p>Téléchargez cartes hors ligne et apps de traduction avant de voyager vers des zones reculées avec connectivité limitée. La fonction caméra de Google Translate peut être inestimable pour lire signes ou menus dans les langues locales.</p>

                <p>Rappelez-vous, l'objectif n'est pas d'être paranoïaque mais préparé. La plupart des voyageurs solo vivent le Belize en sécurité et ont des aventures incroyables. En suivant ces directives et faisant confiance à vos instincts, vous serez bien équipé pour explorer ce magnifique pays avec confiance et sécurité.</p>
              `,
            },
            post3: {
              title: 'Une Semaine à San Ignacio: Choix Budget et Luxe',
              excerpt: 'Que vous voyagiez en sac à dos ou que vous vous fassiez plaisir, voici comment tirer le meilleur parti de la scène d\'aventure de San Ignacio.',
              metaDescription: 'Guide voyage complet 7 jours San Ignacio avec options budget et luxe. Découvrez ruines mayas, aventures jungle et culture locale ouest Belize.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>San Ignacio, niché dans le district Cayo de l'ouest du Belize, sert de base parfaite pour explorer certaines des attractions les plus spectaculaires du pays. Cette charmante ville, avec son atmosphère décontractée et sa position stratégique près de la frontière guatémaltèque, offre accès aux anciennes ruines mayas, réserves de jungle pristines et certaines des aventures les plus palpitantes d'Amérique centrale.</p>
                
                <p>Ce qui rend San Ignacio spécial est sa capacité à satisfaire tous types de voyageurs et budgets. Que vous soyez un backpacker comptant chaque dollar ou cherchant des expériences de luxe, cet itinéraire complet d'une semaine vous aidera à découvrir le meilleur de ce que cette région remarquable a à offrir.</p>

                <h2 id="section1">Jours 1-2: Arrivée et Exploration de la Ville</h2>
                
                <h3>Option Budget</h3>
                <p>Arrivez via chicken bus de Belize City (8 BZ$, 3 heures) pour une expérience locale authentique. Séjournez au Trek Stop (30 BZ$/nuit), un refuge backpacker bien-aimé avec options camping, cuisines communales et atmosphère sociale vibrante où voyageurs du monde entier se rassemblent pour partager histoires et planifier aventures.</p>
                <p>Explorez le Marché San Ignacio pour repas locaux économiques présentant riz et haricots, poulet ragoût et fruits tropicaux frais. Un repas copieux coûte environ 10-15 BZ$. Visitez le site maya gratuit Cahal Pech pour vues coucher de soleil sur la vallée rivière Macal.</p>

                <h3>Option Luxe</h3>
                <p>Arrangez transfert privé de l'aéroport international (400 BZ$) et séjournez au Ka'ana Resort (800+ BZ$/nuit), propriété éco-luxe primée présentant casitas privées, piscines infinité et services spa de classe mondiale entourés de forêt tropicale pristine.</p>
                <p>Dînez au Running W Steakhouse (80-120 BZ$/personne) pour steaks premium et cuisine internationale, ou profitez du restaurant ferme-à-table de Ka'ana présentant ingrédients locaux et cocktails expertement créés en regardant oiseaux exotiques et iguanes dans les jardins du resort.</p>

                <h3>Les Deux Options</h3>
                <p>Explorez les marchés colorés du centre-ville San Ignacio, architecture coloniale et atmosphère locale amicale. Visitez le marché du samedi pour artisanat local, produits frais et nourritures traditionnelles. Promenez-vous tranquillement sur le pont Hawksworth pour vues panoramiques de la rivière Macal et collines environnantes.</p>

                <h2 id="section2">Jours 3-4: Merveilles Mayas Anciennes</h2>
                
                <h3>Caracol et Mountain Pine Ridge</h3>
                <p>Les voyageurs budget peuvent rejoindre tours de groupe (180 BZ$/personne) qui incluent transport, services guide et frais d'entrée à Caracol, plus grand site maya du Belize. Ces excursions journée complète incluent typiquement arrêts aux Rio On Pools et Big Rock Falls pour baignades rafraîchissantes dans piscines montagnes cristallines.</p>
                <p>Les voyageurs luxe peuvent arranger tours guidés privés (800-1200 BZ$/jour) avec archéologues experts, déjeuners pique-nique gourmet et véhicules 4WD confortables. Les tours privés permettent timing flexible, discussions historiques approfondies et accès aux sites moins connus comme Rio Frio Caves.</p>

                <h3>Site Maya Xunantunich</h3>
                <p>Option budget: Prenez bus local vers San Jose Succotz (3 BZ$), ferry manuel à travers rivière Mopan (2 BZ$), puis taxi vers ruines (20 BZ$ aller-retour). Frais entrée 10 BZ$. Apportez eau et collations pour exploration auto-guidée de la pyramide El Castillo et places environnantes.</p>
                <p>Option luxe: Tour guidé privé (400 BZ$/jour) incluant transport, guide expert et déjeuner gourmet. Combinez avec visites aux communautés artisanes locales et tours ferme papillons privés montrant l'incroyable biodiversité du Belize.</p>

                <h2 id="section3">Jours 5-6: Activités Aventure</h2>
                
                <h3>Aventures Grottes</h3>
                <p>ATM Cave (Actun Tunichil Muknal) offre l'une des aventures les plus spectaculaires du Belize. Les voyageurs budget peuvent réserver tours de groupe (180 BZ$/personne) qui incluent transport, guide, casque et lampe frontale. Cette aventure journée complète implique nager à travers rivières souterraines et randonner à travers chambres cérémonielles anciennes.</p>
                <p>Les voyageurs luxe peuvent arranger tailles de groupe plus petites (400 BZ$/personne) avec guides premium, meilleur équipement et attention plus personnalisée. Certains opérateurs offrent guides photographes pour capturer images qualité professionnelle de cette expérience unique.</p>

                <h3>Aventures Rivière</h3>
                <p>Budget: Location canoë sur rivière Macal (40 BZ$/jour) pour exploration auto-guidée. Pagayez vers Chaa Creek Natural History Centre (gratuit avec achat déjeuner) ou simplement profitez flottement paisible rivière en regardant iguanes, oiseaux tropicaux et crocodiles occasionnels.</p>
                <p>Luxe: Tours canoë guidés privés (200 BZ$/personne) avec guides naturalistes, déjeuners gourmet au bord rivière et arrêts aux emplacements exclusifs. Certains tours incluent classes cuisine maya traditionnelle et visites sentiers plantes médicinales avec guides indigènes.</p>

                <h2 id="conclusion">Jour 7: Options Départ</h2>
                
                <h3>Adieu Budget</h3>
                <p>Prenez chicken bus retour vers Belize City (8 BZ$) avec arrêts aux villages locaux pour expériences culturelles authentiques. Achetez souvenirs dernière minute au Marché San Ignacio incluant textiles maya artisanaux, masques bois sculptés et sauces piquantes produites localement.</p>

                <h3>Départ Luxe</h3>
                <p>Transfert privé vers aéroport international (400 BZ$) avec arrêts au spa Black Orchid Resort pour traitements massage d'adieu, ou prolongez avec vol domestique luxe vers Ambergris Caye pour relaxation plage.</p>

                <p>San Ignacio offre le mélange parfait d'aventure, culture et beauté naturelle peu importe votre budget. La clé est choisir des expériences qui s'alignent avec votre style voyage tout en restant ouvert aux rencontres inattendues qui rendent le Belize vraiment magique. Que vous dormiez dans une couchette backpacker ou suite luxe, les ruines mayas, aventures jungle et hospitalité belizienne chaleureuse restent également accessibles et inoubliables.</p>
              `,
            },
            post4: {
              title: 'Observation de la Faune: Guide du Voyageur Solo',
              excerpt: 'Repérez jaguars, singes hurleurs et oiseaux exotiques à votre rythme avec ces conseils d\'observation de la faune.',
              metaDescription: 'Guide complet observation faune pour voyageurs solo au Belize. Apprenez à repérer jaguars, singes hurleurs, toucans et autres animaux exotiques en sécurité.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Le Belize est une destination de rêve pour les passionnés de faune, abritant plus de 500 espèces d'oiseaux, 145 espèces de mammifères et d'innombrables reptiles et amphibiens. Pour les voyageurs solo, l'observation de la faune offre des moments de connexion profonde avec la nature et des opportunités de photographie incroyables. Ce guide complet vous aidera à maximiser vos rencontres avec la faune en voyageant indépendamment au Belize.</p>
                
                <p>Les écosystèmes diversifiés du pays - des récifs coralliens aux forêts tropicales, des marécages de mangroves aux savanes de pins - fournissent des habitats pour une variété extraordinaire d'espèces. Beaucoup d'animaux sont endémiques à l'Amérique centrale, faisant du Belize une destination unique pour l'observation de la faune. Les voyageurs solo ont souvent des avantages dans l'observation de la faune, se déplaçant silencieusement et patiemment dans des environnements où les groupes touristiques pourraient déranger les animaux sensibles.</p>

                <h2 id="section1">Lieux Prime d'Observation de la Faune</h2>
                
                <h3>Sanctuaire de Faune du Bassin Cockscomb</h3>
                <p>Connu comme la première réserve de jaguars au monde, le Bassin Cockscomb offre la meilleure chance d'apercevoir ces grands félins insaisissables dans la nature. Bien que les observations de jaguars soient rares et nécessitent de la patience, le sanctuaire garantit des rencontres avec singes hurleurs, toucans et plus de 290 espèces d'oiseaux. Les voyageurs solo apprécient les sentiers de randonnée bien marqués et les hébergements confortables du sanctuaire.</p>
                <p>Les visites matinales précoces donnent la plus haute activité faunique. Le Sentier Victoria Peak défie les randonneurs expérimentés avec observations potentielles d'ocelots, margays et du rare tapir de Baird. Les tours nocturnes révèlent un écosystème complètement différent avec chauves-souris, hiboux et mammifères nocturnes.</p>

                <h3>Zoo du Belize et Centre d'Éducation Tropicale</h3>
                <p>Souvent appelé "le meilleur petit zoo du monde", le Zoo du Belize abrite uniquement des espèces natives dans des habitats naturels. C'est votre opportunité garantie de voir jaguars, pumas, ocelots, jaguarundis et margays de près. Les tours nocturnes du zoo offrent des rencontres palpitantes avec prédateurs nocturnes dans leur état le plus actif.</p>
                <p>Les voyageurs solo adorent les programmes éducatifs et ateliers de photographie offerts tout au long de l'année. Le Centre d'Éducation Tropicale adjacent fournit hébergements de nuit au cœur du zoo, permettant observation de la faune à l'aube et au crépuscule quand les animaux sont les plus actifs.</p>

                <h3>Sanctuaire de Faune Crooked Tree</h3>
                <p>Ce système de lagunes de 16 400 acres accueille la plus grande concentration d'oiseaux migrateurs du Belize. Entre novembre et mai, des milliers d'oiseaux incluant cigognes jabiru, grands hérons bleus et aigrettes neigeuses se rassemblent ici. Les passerelles surélevées et tours d'observation du sanctuaire fournissent d'excellents points de vue pour photographie et observation.</p>
                <p>Les voyageurs solo peuvent explorer en canoë, se déplaçant silencieusement dans les voies d'eau où caïmans, iguanes et innombrables espèces d'oiseaux prospèrent. Les guides locaux offrent connaissance spécialisée sur migrations saisonnières et temps de visionnement optimaux.</p>

                <h2 id="section2">Conseils Essentiels d'Observation de la Faune</h2>
                
                <h3>Timing et Comportement</h3>
                <p>L'activité faunique atteint son pic durant l'aube et le crépuscule quand les températures sont plus fraîches et les animaux émergent pour se nourrir. Planifiez vos sessions d'observation de faune les plus importantes durant ces heures dorées. La chaleur de midi pousse la plupart des mammifères à l'abri, mais reptiles et certaines espèces d'oiseaux restent actifs.</p>
                <p>Déplacez-vous lentement et silencieusement dans les environnements naturels. Les mouvements brusques et bruits forts disperseront la faune avant que vous ayez des opportunités d'observation. Les voyageurs solo ont des avantages ici - vous contrôlez votre rythme et niveau de bruit sans dynamiques de groupe.</p>

                <h3>Photographie et Équipement</h3>
                <p>Apportez des jumelles pour observation de faune distante et objectifs téléphoto pour photographie. Un objectif 300mm minimum est recommandé pour photographie d'oiseaux, tandis que photographie de mammifères peut nécessiter des longueurs focales plus longues. Emportez batteries et cartes mémoire supplémentaires - les rencontres avec la faune arrivent souvent rapidement.</p>
                <p>Considérez embaucher des guides locaux qui connaissent les modèles de comportement animal et mouvements saisonniers. Leur expertise augmente dramatiquement vos chances de rencontres fauniques significatives tout en assurant votre sécurité dans zones reculées.</p>

                <h2 id="conclusion">Sécurité et Conservation</h2>
                <p>Respectez la faune en maintenant distances sécuritaires et ne nourrissant jamais les animaux. Nourrir perturbe les modèles de comportement naturels et peut rendre les animaux agressifs ou dépendants des humains. Suivez les principes Leave No Trace et soutenez les efforts de conservation à travers des choix de tourisme responsable.</p>
                <p>L'observation solo de la faune au Belize offre des opportunités inégalées pour connexion personnelle avec la nature. Que vous photographiez un quetzal resplendissant ou écoutiez les appels de singes hurleurs résonner dans la jungle, ces rencontres créeront des souvenirs durables et approfondiront votre appréciation de l'incroyable biodiversité du Belize.</p>
              `,
            },
            post5: {
              title: 'Belize Économique: Voyage Solo à 50$/Jour',
              excerpt: 'Découvrez comment vivre les merveilles du Belize sans vous ruiner, des auberges à la nourriture de rue.',
              metaDescription: 'Guide voyage budget complet pour Belize à 50$/jour. Apprenez hébergements pas chers, nourriture locale, activités gratuites et conseils économies voyageurs solo.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Contrairement à la croyance populaire, le Belize n'a pas besoin de vider votre compte en banque. Bien qu'il soit vrai que le Belize peut être cher comparé à d'autres destinations d'Amérique centrale, les voyageurs solo avisés peuvent expérimenter ce pays incroyable avec un budget de 50$ par jour ou moins. Ce guide complet révèle des secrets d'initiés pour hébergements abordables, repas locaux délicieux, activités gratuites et stratégies d'économie d'argent.</p>
                
                <p>La clé du voyage budget au Belize réside dans l'adoption de la culture locale, séjourner dans des hébergements budget, manger où mangent les locaux et profiter d'activités gratuites ou peu coûteuses. Les voyageurs solo ont des avantages supplémentaires - vous pouvez être flexible avec vos plans, profiter d'offres de dernière minute et facilement vous connecter avec d'autres voyageurs budget pour opportunités de partage de coûts.</p>

                <h2 id="section1">Stratégies d'Hébergement Budget</h2>
                
                <h3>Auberges et Maisons d'Hôtes (15-25$/nuit)</h3>
                <p>Le Belize a un réseau croissant d'auberges backpacker offrant lits de dortoir pour 15-25 BZ$ par nuit. Options populaires incluent The Trek Stop à San Ignacio, Bella's Backpackers à Caye Caulker et Ruby's Hotel à San Pedro. Ces établissements incluent souvent installations de cuisine, vous permettant de préparer vos propres repas et économiser significativement sur coûts de nourriture.</p>
                <p>Les maisons d'hôtes locales fournissent expériences authentiques à prix budget. Les établissements familiaux offrent souvent petit déjeuner et perspectives locales que les hôtels de chaîne ne peuvent égaler. Réservez directement avec propriétés pour éviter frais de réservation et parfois négocier meilleurs tarifs pour séjours plus longs.</p>

                <h3>Hébergements Alternatifs</h3>
                <p>Considérez options camping où disponibles - certaines auberges offrent sites de tente pour 10-15 BZ$ par nuit. Opportunités de garde de maison existent dans communautés d'expatriés, particulièrement autour de San Pedro et Placencia. Plateformes en ligne connectent voyageurs avec propriétaires nécessitant gardiens de propriété durant leur absence.</p>
                <p>Couchsurfing a une communauté petite mais active au Belize, particulièrement à Belize City et San Ignacio. Cette option fournit hébergement gratuit plus connaissance d'initié local de vos hôtes.</p>

                <h2 id="section2">Manger avec Budget</h2>
                
                <h3>Scène Culinaire Locale (3-8$/repas)</h3>
                <p>Nourriture de rue et eateries locaux offrent cuisine belizienne authentique à fraction des prix de restaurants touristiques. Une assiette de riz et haricots avec poulet coûte 6-8 BZ$ dans restaurants locaux. Vendeurs de rue vendent délicieux burritos petit déjeuner pour 3-4 BZ$ et fruits frais pour moins de 2 BZ$.</p>
                <p>Visitez marchés locaux pour produits incroyablement pas chers, pain frais et collations traditionnelles. Le Marché Central de Belize City et le Marché du Samedi de San Ignacio offrent les meilleurs prix et sélection. Faites provision de fruits, légumes et basics pour repas auto-cuisinés.</p>

                <h3>Stratégies d'Auto-Restauration</h3>
                <p>Choisissez hébergements avec installations de cuisine et cuisinez vos propres repas. Supermarchés locaux comme Brodies et Save-U offrent prix raisonnables pour basics. Une semaine d'épiceries coûte 40-60 BZ$ si vous magasinez intelligemment et cuisinez la plupart des repas vous-même.</p>
                <p>Emportez bouteille d'eau réutilisable et utilisez stations d'eau filtrée disponibles dans la plupart des auberges. Coûts d'eau embouteillée s'accumulent rapidement dans climats tropicaux où vous avez besoin d'hydratation constante.</p>

                <h2 id="section3">Activités Gratuites et Peu Coûteuses</h2>
                
                <h3>Attractions Naturelles</h3>
                <p>Beaucoup des meilleures attractions du Belize sont gratuites ou très peu coûteuses. Sentiers de randonnée dans Mountain Pine Ridge, nager dans piscines naturelles comme Rio On Pools et Big Rock Falls, et explorer ruines mayas Cahal Pech (admission gratuite) fournissent expériences incroyables sans frais d'admission.</p>
                <p>Accès plage est gratuit partout au Belize. Passez jours nageant, snorkeling depuis rivage et cherchant coquillages sans payer frais de resort. Plages publiques à Hopkins, Placencia et Caye Caulker offrent expériences de classe mondiale sans coût.</p>

                <h3>Expériences Culturelles</h3>
                <p>Assistez festivals locaux et événements pour immersion culturelle authentique. Beaucoup de communautés hébergent performances musicales gratuites, spectacles de danse traditionnelle et célébrations culturelles tout au long de l'année. Vérifiez centres communautaires et journaux locaux pour événements à venir.</p>
                <p>Tours à pied de zones historiques comme district colonial de Belize City et centre-ville de San Ignacio fournissent éducation culturelle sans coût. Beaucoup de sites offrent matériaux de tour auto-guidé gratuits.</p>

                <h2 id="conclusion">Conseils Transport Économie d'Argent</h2>
                <p>Utilisez bus locaux au lieu de navettes touristiques - chicken buses coûtent 3-8 BZ$ pour routes longue distance comparé à 25-40 BZ$ pour transport touristique. Bus circulent régulièrement entre destinations majeures et fournissent expériences locales authentiques.</p>
                <p>Voyage budget au Belize nécessite planification et flexibilité, mais les récompenses sont immenses. Vous expérimenterez culture locale authentique, rencontrerez compagnons voyageurs budget du monde entier et prouverez que aventures incroyables ne nécessitent pas budgets illimités. Avec planification soigneuse et connaissance locale, 50$/jour fournit hébergement confortable, repas délicieux et expériences inoubliables partout dans le beau Belize.</p>
              `,
            },
            post6: {
              title: 'Meilleur Moment pour Visiter le Belize en Solo',
              excerpt: 'Météo, foules et coûts - tout ce que vous devez savoir sur le timing de votre aventure solo au Belize.',
              metaDescription: 'Guide saisonnier complet pour voyage solo au Belize. Apprenez modèles météo, saisons touristiques, coûts et timing optimal pour différentes activités.',
              fullContent: `
                <h2 id="introduction">Introduction</h2>
                <p>Chronométrer votre aventure solo au Belize peut dramatiquement impacter votre expérience, budget et sécurité. Ce paradis tropical jouit de chaleur toute l'année, mais saisons sèches et humides distinctes créent différences significatives dans modèles météo, foules touristiques, prix et disponibilité d'activités. Comprendre ces variations saisonnières aide voyageurs solo optimiser leur aventure belizienne pour leurs priorités et préférences spécifiques.</p>
                
                <p>La location du Belize dans le bassin caribéen signifie qu'il expérimente modèles météo tropicaux typiques avec deux saisons principales. Cependant, microclimats varient significativement à travers le pays - zones côtières diffèrent des montagnes intérieures, et régions nord expérimentent modèles différents que zones sud. Ce guide décompose timing optimal pour diverses activités et styles de voyage.</p>

                <h2 id="section1">Saison Sèche: Décembre à Mai</h2>
                
                <h3>Haute Saison (Décembre-Avril)</h3>
                <p>La saison sèche représente la période touristique de pointe du Belize, apportant la météo la plus prévisible mais aussi les prix les plus élevés et plus grandes foules. Températures quotidiennes vont de 21-29°C avec précipitations minimales et vents alizés constants fournissant climatisation naturelle. Cette période offre conditions optimales pour toutes activités extérieures incluant plongée, snorkeling, randonnée et exploration de sites mayas.</p>
                <p>Voyageurs solo bénéficient d'horaires de transport augmentés, opérations de tour étendues et options d'hébergement maximales. Cependant, réservation à l'avance devient essentielle, et prix peuvent doubler comparé aux tarifs basse saison. Destinations populaires comme Ambergris Caye et Placencia atteignent capacité durant vacances Noël, Nouvel An et Pâques.</p>

                <h3>Fin Saison Sèche (Mars-Mai)</h3>
                <p>Mars à mai offre le meilleur équilibre de bon temps et prix raisonnables. Températures montent graduellement, atteignant chaleur de pointe en mai, mais précipitations restent minimales. Cette période fournit excellente visibilité plongée, conditions randonnée optimales et temps plage confortable sans foules et coûts haute saison.</p>
                <p>Voyageurs solo trouvent ceci idéal pour rencontrer autres voyageurs tout en évitant foules écrasantes. Prix hébergement baissent 20-30% comparé aux mois de pointe, et opérateurs de tour offrent attention plus personnalisée avec tailles de groupe plus petites.</p>

                <h2 id="section2">Saison Humide: Juin à Novembre</h2>
                
                <h3>Début Saison Humide (Juin-Août)</h3>
                <p>Malgré la désignation "saison humide", mois début été fournissent souvent excellent temps avec orages après-midi dégageant chaleur et humidité. Matins présentent typiquement ciels clairs parfaits pour activités extérieures, tandis que brèves averses après-midi fournissent soulagement bienvenu de chaleur tropicale.</p>
                <p>Cette période offre avantages significatifs pour voyageurs solo soucieux du budget - coûts hébergement baissent 40-50%, restaurants offrent spéciaux basse saison, et opérateurs de tour fournissent prix plus flexibles. Activité faune augmente avec sources d'eau abondantes, rendant idéal pour enthousiastes nature.</p>

                <h3>Pic Saison Humide (Septembre-Novembre)</h3>
                <p>Septembre à novembre apporte les précipitations les plus lourdes et risque d'ouragan, rendant la période touristique la moins populaire. Cependant, voyageurs solo expérimentés peuvent trouver valeur incroyable et expériences uniques durant ces mois. Pluie tombe typiquement en averses après-midi plutôt que bruine toute journée, laissant matins clairs pour activités.</p>
                <p>Saison ouragan nécessite flexibilité et assurance voyage, mais impacts d'ouragan actuels sont relativement rares. Beaucoup d'établissements ferment durant octobre pour maintenance, réduisant options hébergement et restauration mais créant opportunités pour expériences locales authentiques.</p>

                <h2 id="section3">Timing Spécifique aux Activités</h2>
                
                <h3>Plongée et Snorkeling</h3>
                <p>Conditions plongée optimales arrivent durant saison sèche (décembre-mai) quand visibilité atteint 30+ mètres et mers restent calmes. Cependant, plongée saison humide offre avantages incluant moins de foules, tarifs réduits et comportement unique vie marine. Saison requin baleine pic juin-septembre, fournissant rencontres classe mondiale pour plongeurs patients.</p>
                <p>Voyageurs solo peuvent facilement rejoindre groupes plongée toute l'année, mais réservation à l'avance devient essentielle durant saison sèche. Saison humide offre opportunités plus spontanées et instruction personnalisée.</p>

                <h3>Observation Faune</h3>
                <p>Activité faune varie dramatiquement par saison. Saison sèche concentre animaux autour sources d'eau, augmentant opportunités observation mais potentiellement stressant faune. Saison humide fournit nourriture et eau abondantes, menant à comportement animal plus naturel et meilleures opportunités photographie.</p>
                <p>Observation oiseaux pic durant mois hiver nord (décembre-mars) quand espèces migratrices arrivent. Saison nidification (avril-juin) offre observations comportementales uniques mais nécessite distance respectueuse de faune sensible.</p>

                <h2 id="conclusion">Recommandations Voyageurs Solo</h2>
                <p>Pour visiteurs première fois priorisant météo prévisible et options activité maximales, planifiez visites durant février-avril quand conditions sont optimales et infrastructure touristique opère à pleine capacité. Voyageurs soucieux budget devraient considérer juin-août pour économies significatives avec conditions météo acceptables.</p>
                <p>Chercheurs aventure et voyageurs expérimentés pourraient préférer visites saison humide (septembre-novembre) pour expériences authentiques, paysages dramatiques et foules minimales. Peu importe timing, voyageurs solo bénéficient de la taille compacte du Belize et chaleur toute l'année - toute saison offre expériences incroyables pour ceux préparés aux conditions locales.</p>
              `,
            },
          },
          components: {
            tableOfContents: 'Table des Matières',
            relatedPosts: 'Articles Connexes',
            relatedPostsComingSoon: 'Articles connexes à venir...',
            stayUpdated: 'Restez Informé',
            stayUpdatedDescription: 'Recevez les derniers conseils de voyage et guides du Belize dans votre boîte de réception.',
            enterEmail: 'Entrez votre email',
            subscribe: 'S\'abonner',
            minRead: 'min de lecture',
            views: 'vues',
          },
          tags: {
            'Solo Travel': 'Voyage Solo',
            'Adventure': 'Aventure',
            'Belize': 'Belize',
            'Travel Tips': 'Conseils de Voyage',
            'Safety': 'Sécurité',
            'San Ignacio': 'San Ignacio',
            'Budget Travel': 'Voyage Budget',
            'Luxury Travel': 'Voyage de Luxe',
            'Wildlife': 'Faune',
            'Nature': 'Nature',
            'Photography': 'Photographie',
            'Money Saving': 'Économie d\'Argent',
            'Backpacking': 'Sac à Dos',
            'Travel Planning': 'Planification de Voyage',
            'Weather': 'Météo',
            'Seasons': 'Saisons',
          },
          categories: {
            'Safety': 'Sécurité',
            'Adventures': 'Aventures',
            'Destinations': 'Destinations',
            'Wildlife': 'Faune',
            'Budget Travel': 'Voyage Budget',
            'Travel Planning': 'Planification de Voyage',
          },
          socialMedia: {
            facebookLabel: 'Suivez-nous sur Facebook',
            instagramLabel: 'Suivez-nous sur Instagram',
          },
        },
        adventureCards: {
          title: 'Aventures Vedettes',
          subtitle: 'Découvrez des expériences uniques conçues pour les voyageurs solo et les petits groupes',
          highlights: 'Points Forts',
          viewAllAdventures: 'Voir Toutes les Aventures',
          adventures: {
            1: {
              title: 'Tubing en Grotte et Randonnée Jungle',
              description: 'Flottez à travers les systèmes de grottes souterraines anciennes et explorez les sentiers de jungle pristine.',
              highlights: ['Grottes Mayas anciennes', 'Observation de la faune jungle', 'Guide professionnel', 'Équipement inclus'],
            },
            2: {
              title: 'Plongée avec Tuba à Hol Chan',
              description: 'Découvrez des récifs coralliens vibrants et la vie marine tropicale dans la réserve marine principale du Belize.',
              highlights: ['Réserve Marine Hol Chan', 'Shark Ray Alley', 'Jardins de coraux colorés', 'Tout l\'équipement fourni'],
            },
            3: {
              title: 'Aventure Ruines Mayas Caracol',
              description: 'Explorez le plus grand site archéologique Maya du Belize caché au fond de la jungle.',
              highlights: ['Temples Mayas anciens', 'Vues de la canopée jungle', 'Perspectives historiques', 'Déjeuner inclus'],
            },
            4: {
              title: 'Expérience Plongée Blue Hole',
              description: 'Plongez dans le célèbre Blue Hole, un site du patrimoine mondial de l\'UNESCO.',
              highlights: ['Patrimoine Mondial UNESCO', 'Formation géologique unique', 'Guides de plongée experts', 'Certificat requis'],
            },
            5: {
              title: 'Tyrolienne Jungle et Cascade',
              description: 'Planez à travers la canopée jungle et rafraîchissez-vous dans des piscines naturelles.',
              highlights: ['Tyrolienne canopée', 'Cascades naturelles', 'Opportunités de baignade', 'Certifié sécurité'],
            },
            6: {
              title: 'Observation Lamantins et Journée Plage',
              description: 'Rencontres douces avec les lamantins suivies de détente sur des plages pristines.',
              highlights: ['Visite sanctuaire lamantins', 'Plages pristines', 'Déjeuner plage', 'Focus conservation'],
            },
            7: {
              title: 'Pêche Lever de Soleil et Saut d\'Îles',
              description: 'Commencez votre journée avec la pêche au lever du soleil suivie de plongée avec tuba et exploration des cayes pristines autour d\'Ambergris.',
              highlights: ['Départ matinal pour meilleure pêche', 'Équipement plongée inclus', 'Déjeuner ceviche frais sur bateau'],
            },
            8: {
              title: 'VTT et Journée Plage',
              description: 'Pédalez à travers les villages Garifuna et les sentiers jungle, terminant par la détente sur les plages Caraïbes pristines.',
              highlights: ['Interactions villages culturels', 'VTT à travers sentiers jungle', 'Déjeuner Garifuna traditionnel inclus'],
            },
            9: {
              title: 'Safari Jungle Nocturne',
              description: 'Vivez la jungle s\'animer la nuit avec des visites guidées à travers le territoire de la réserve de jaguars.',
              highlights: ['Observation faune nocturne', 'Équipement vision nocturne professionnel', 'Exploration réserve jaguars'],
            },
            10: {
              title: 'Visite Village Culturel et Fabrication Chocolat',
              description: 'Visitez des villages Mayas authentiques et apprenez les techniques traditionnelles de fabrication du chocolat de la fève à la barre.',
              highlights: ['Expérience village Maya authentique', 'Atelier fabrication chocolat traditionnel', 'Échange culturel avec familles locales'],
            },
          },
        },
        home: {
          hero: {
            title: 'Votre Aventure Vous Attend',
            subtitle: 'Quelle est votre ambiance? Recherchez une aventure ou choisissez une expérience populaire.',
            searchPlaceholder: 'Ex: \'tubing en grotte\', \'ruines mayas\'',
            caveTubing: 'Tubing en Grotte',
            mayaRuins: 'Ruines Mayas',
            snorkeling: 'Plongée avec Tuba',
          },
        },
        contact: {
          hero: {
            title: 'Connectons-Nous',
            subtitle: 'Des questions sur votre aventure au Belize? Nous sommes là pour vous aider avec les demandes de réservation, les préoccupations de sécurité et tout le reste.',
            buttonText: 'Entrer en Contact',
          },
          info: {
            title: 'Comment Nous Joindre',
            subtitle: 'Nous sommes basés dans le magnifique Belize et prêts à vous aider à planifier votre aventure parfaite. Notre expertise locale vous garantit l\'expérience la plus authentique possible.',
            belizeOffice: 'Bureau Belize',
            phone: 'Téléphone',
            email: 'Email',
            officeHours: 'Heures de Bureau',
            address1: 'San Pedro, Ambergris Caye',
            address2: 'Belize, Amérique Centrale',
            tollFree: 'Sans Frais: +1-800-XXX-XXXX',
            belizeLocal: 'Local Belize: +501-XXX-XXXX',
            emailGeneral: 'hello@belizevibes.com',
            emailBooking: 'booking@belizevibes.com',
            hoursWeekday: 'Lundi - Vendredi: 8h00 - 18h00 (Heure Belize)',
            hoursSaturday: 'Samedi: 9h00 - 16h00',
            hoursSunday: 'Dimanche: Fermé',
          },
          map: {
            title: 'Carte Interactive',
            subtitle: 'Intégration Google Maps bientôt disponible',
          },
          form: {
            title: 'Envoyez-nous un Message',
            subtitle: 'Que vous planifiez votre première aventure au Belize ou ayez des questions spécifiques sur la sécurité et les voyages solo, nous sommes là pour vous aider.',
            fullName: 'Nom Complet *',
            emailAddress: 'Adresse Email *',
            subject: 'Sujet',
            message: 'Message *',
            fullNamePlaceholder: 'Entrez votre nom complet',
            emailPlaceholder: 'votre.email@exemple.com',
            messagePlaceholder: 'Parlez-nous de vos plans d\'aventure au Belize, toutes questions que vous avez, ou comment nous pouvons vous aider...',
            sendMessage: 'Envoyer le Message',
            sendingMessage: 'Envoi du Message...',
            successMessage: 'Merci! Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.',
          },
          subjects: {
            general: 'Demande Générale',
            booking: 'Question de Réservation',
            press: 'Presse et Médias',
            safety: 'Préoccupations de Sécurité',
          },
        },
        safety: {
          hero: {
            title: 'Votre Sécurité, Notre Priorité',
            subtitle: 'Tout ce que vous devez savoir pour voyager en toute confiance au Belize.',
          },
          topics: {
            travelInsurance: {
              title: 'Assurance Voyage',
              content: 'Nous recommandons fortement une assurance voyage complète couvrant les urgences médicales, l\'annulation de voyage et les activités d\'aventure. Beaucoup de polices standard excluent le tubing en grotte et la plongée—assurez-vous que votre police couvre toutes les activités prévues.',
            },
            emergencyNumbers: {
              title: 'Numéros d\'Urgence Locaux',
              content: 'Police: 911 ou 90 • Incendie/Ambulance: 911 • Police Touristique: 227-2222 • Notre Ligne d\'Urgence 24/7: +501-XXX-XXXX. Enregistrez ces numéros dans votre téléphone et gardez une copie physique dans votre portefeuille.',
            },
            groupSupport: {
              title: 'Support de Groupe pour Voyageurs Solo',
              content: 'Ne vous sentez jamais seul dans votre aventure. Nos petites tailles de groupe (max 8 personnes) assurent une attention personnalisée. Chaque groupe a des guides certifiés avec formation de premiers secours en nature et dispositifs de communication satellite.',
            },
            localCustoms: {
              title: 'Respecter les Coutumes Locales',
              content: 'Le Belize est accueillant et diversifié. Habillez-vous modestement lors de visites de villages ou sites religieux. Apprenez les salutations créoles de base. Donnez des pourboires appropriés aux guides et personnel de service. Demandez la permission avant de photographier les gens.',
            },
            weatherAlerts: {
              title: 'Alertes Météo',
              content: 'La saison des ouragans s\'étend de juin à novembre. La saison sèche (décembre-mai) est idéale pour la plupart des activités. Nous surveillons constamment la météo et reprogrammerons ou modifierons les voyages pour la sécurité. Des inondations soudaines peuvent survenir pendant la saison des pluies.',
            },
            healthWater: {
              title: 'Santé et Sécurité de l\'Eau',
              content: 'L\'eau du robinet est généralement sûre dans les zones touristiques, mais l\'eau embouteillée est recommandée. Apportez un répulsif à insectes pour les excursions en jungle. Aucune vaccination spéciale requise, mais consultez votre médecin. La crème solaire est essentielle toute l\'année.',
            },
          },
          sidebar: {
            emergencyContacts: 'Contacts d\'Urgence',
            travelResources: 'Ressources de Voyage',
            currentWeather: 'Météo Actuelle: Dégagé',
            perfectConditions: 'Conditions parfaites pour les aventures',
            belizeGovAlerts: 'Alertes de Voyage Gouvernement Belize',
            usStateDept: 'Département d\'État US - Belize',
            weatherConditions: 'Conditions Météo Actuelles',
          },
          contacts: {
            policeEmergency: 'Urgence Police',
            fireAmbulance: 'Incendie/Ambulance',
            touristPolice: 'Police Touristique',
            belizeVibes24: 'BelizeVibes 24/7',
            usEmbassy: 'Ambassade US Belize',
            karlHeusner: 'Hôpital Mémorial Karl Heusner',
          },
          cta: {
            title: 'Avez-vous Encore des Questions?',
            content: 'Notre équipe est disponible 24/7 pendant votre voyage et heureuse de répondre à toute préoccupation de sécurité avant votre réservation.',
            button: 'Contactez-nous à Tout Moment',
          },
        },
        about: {
          hero: {
            title: 'Notre Histoire',
            subtitle: 'Rencontrez les personnes derrière les aventures solo les plus audacieuses du Belize.',
          },
          story: {
            title: 'Propriété Locale. Inspiration Mondiale.',
            content: 'BelizeVibes a été fondé par Dimitre Sleeuw et un groupe de jeunes Béliziens certifiés et passionnés. Notre objectif est de permettre aux voyageurs solo de découvrir le Belize de manière authentique, sûre et durable. Avec des racines profondes dans notre culture et une formation en éco-tourisme et hospitalité, nous offrons plus que de simples voyages—nous créons des connexions significatives.',
          },
          values: {
            authenticity: {
              title: 'Authenticité',
              description: 'Expériences béliziennes authentiques créées par des locaux qui connaissent chaque joyau caché.',
            },
            safety: {
              title: 'Sécurité',
              description: 'Guides certifiés et protocoles de sécurité complets pour des aventures sans souci.',
            },
            localExpertise: {
              title: 'Expertise Locale',
              description: 'Nés et élevés au Belize, notre équipe partage des connaissances privilégiées et des aperçus culturels.',
            },
            sustainableTravel: {
              title: 'Voyage Durable',
              description: 'Pratiques éco-certifiées qui protègent la beauté naturelle du Belize pour les générations futures.',
            },
          },
          team: {
            title: 'Rencontrez Notre Équipe',
            subtitle: 'Locaux passionnés dédiés à vous montrer le vrai Belize',
          },
          cta: {
            title: 'Vous Voulez Nous Rejoindre?',
            content: 'Nous recherchons toujours des guides passionnés et certifiés qui partagent notre vision d\'expériences de voyage durables et authentiques.',
            email: 'careers@belizevibes.com',
          },
        },
        adventureDetail: {
          loading: 'Chargement...',
          notFound: {
            title: 'Aventure Introuvable',
            returnHome: 'Retour Accueil',
          },
          hero: {
            upTo: 'Jusqu\'à',
          },
          overview: {
            title: 'Aperçu',
            reviews: 'avis',
            highlights: 'Points Forts',
            whatsIncluded: 'Ce Qui Est Inclus',
            whatToBring: 'Quoi Apporter',
            notSuitableFor: 'Ne Convient Pas Pour',
          },
          tabs: {
            reviews: 'Avis',
            itinerary: 'Itinéraire',
            faqs: 'FAQ',
          },
          reviews: {
            noReviews: 'Aucun avis pour le moment. Soyez le premier à partager votre expérience!',
            verified: 'Vérifié',
          },
          placeholders: {
            itinerary: 'Itinéraire détaillé bientôt disponible...',
            faqs: 'FAQ bientôt disponibles...',
          },
          pricing: {
            from: 'À partir de',
            person: '/personne',
            bookNow: 'Réserver',
            freeCancellation: 'Annulation gratuite jusqu\'à 24 heures avant',
          },
          quickDetails: {
            duration: 'Durée',
            groupSize: 'Taille du Groupe',
            difficulty: 'Difficulté',
            hours: 'heures',
          },
          safetyTrust: {
            title: 'Sécurité et Confiance',
            licensedInsured: 'Licencié et Assuré',
            safetyEquipment: 'Équipement de Sécurité Fourni',
            support24: 'Support 24/7',
            satisfactionGuarantee: 'Garantie Satisfaction 100%',
          },
          toast: {
            signInWishlist: 'Veuillez vous connecter pour ajouter aux favoris',
            addedToWishlist: 'Ajouté aux favoris',
            removedFromWishlist: 'Retiré des favoris',
            linkCopied: 'Lien copié dans le presse-papier',
            failedToLoad: 'Échec du chargement des détails de l\'aventure',
          },
          difficulties: {
            easy: 'Facile',
            moderate: 'Modéré',
            challenging: 'Difficile',
            extreme: 'Extrême',
          },
          socialProof: {
            title: 'Preuve Sociale',
            recentBookings: 'Réservations récentes',
            peopleViewing: 'Personnes qui regardent',
            availability: 'Disponibilité',
            thisWeek: 'cette semaine',
            today: 'aujourd\'hui',
            onlyXSpotsLeft: 'Seulement {{count}} places restantes!',
            popularChoice: 'Choix Populaire - {{count}}+ réservations',
            earlyBird: 'Lève-tôt: {{percent}}% réduc.',
            lastBooked: 'Dernière réservation: {{time}}',
            recentBookingsTitle: 'Réservations Récentes',
            satisfactionRate: 'Taux de Satisfaction',
            repeatCustomers: 'Clients Fidèles',
            timeAgo: {
              justNow: 'À l\'instant',
              hoursAgo: 'Il y a {{hours}}h',
              yesterday: 'Hier',
              daysAgo: 'Il y a {{days}}j',
            },
            mockTimes: {
              hoursAgo2: 'Il y a 2 heures',
              hoursAgo5: 'Il y a 5 heures',
              dayAgo1: 'Il y a 1 jour',
              daysAgo2: 'Il y a 2 jours',
              daysAgo3: 'Il y a 3 jours',
            },
          },
        },
        booking: {
          stepIndicator: {
            stepXOfY: 'Étape {{current}} de {{total}}',
            percentComplete: '{{percent}}% Complété',
          },
          steps: {
            titles: {
              dateTime: 'Date et Heure',
              groupSize: 'Taille du Groupe',
              guestDetails: 'Détails Invités',
              addOns: 'Extras',
              payment: 'Paiement',
            },
            descriptions: {
              dateTime: 'Choisissez la date de votre aventure',
              groupSize: 'Sélectionnez le nombre de participants',
              guestDetails: 'Vos informations',
              addOns: 'Améliorez votre expérience',
              payment: 'Paiement sécurisé',
            },
            stepXOfY: 'Étape {{current}} de {{total}}',
          },
          step2: {
            headers: {
              howManyPeople: 'Combien de Personnes?',
              priceBreakdown: 'Détail des Prix',
              availableDiscounts: 'Réductions Disponibles',
              capacityInformation: 'Information Capacité',
            },
            labels: {
              participant: 'Participant',
              participants: 'Participants',
              solo: 'Solo',
              couple: 'Couple',
              group: 'Groupe',
              total: 'Total',
              spots: 'places',
            },
            messages: {
              onlyXSpotsLeft: 'Seulement {{count}} places restantes pour cette date!',
              soloTravelerFriendly: 'Idéal pour Voyageurs Solo',
              soloDescription: 'Cette aventure est parfaite pour les voyageurs solo. Vous rejoindrez un petit groupe d\'aventuriers partageant les mêmes idées!',
              groupBenefits: 'Avantages Groupe',
              groupDescription: 'Excellent choix pour les groupes! Vous obtiendrez une remise et pourrez profiter d\'une expérience plus personnalisée.',
            },
            pricing: {
              participantCount: '{{price}}$ × {{count}} participant',
              participantCountPlural: '{{price}}$ × {{count}} participants',
              groupDiscount: 'Remise groupe ({{percent}}% réduc.)',
              earlyBirdDiscount: 'Remise lève-tôt',
              taxesAndFees: 'Taxes et frais',
            },
            capacity: {
              maxGroupSize: 'Taille max. du groupe:',
              availableSpots: 'Places disponibles pour cette date:',
              yourSelection: 'Votre sélection:',
            },
            discountTypes: {
              groupDiscount: 'Remise Groupe',
              earlyBird: 'Lève-tôt',
            },
            discountDescriptions: {
              groupDiscountDesc: '{{percent}}% réduc. pour groupes de 4+',
              earlyBirdDesc: '{{percent}}% réduc. en réservant {{days}} jours à l\'avance',
            },
          },
          labels: {
            selectDate: 'Sélectionner Date',
            selectTime: 'Sélectionner Heure',
            numberOfParticipants: 'Nombre de Participants',
            pricingBreakdown: 'Détail des Prix',
          },
          placeholders: {
            pickDate: 'Choisir une date',
            chooseTime: 'Choisir une heure',
            enterPromoCode: 'Entrer code promo',
          },
          buttons: {
            havePromoCode: 'Avez-vous un code promo?',
            apply: 'Appliquer',
            bookNow: 'Réserver',
          },
          messages: {
            wontBeChargedYet: 'Vous ne serez pas facturé maintenant',
            freeCancellation: 'Annulation gratuite jusqu\'à 24h avant',
            fullRefund: 'Obtenez un remboursement complet si vous annulez au moins 24 heures à l\'avance.',
          },
          step1: {
            selectDate: 'Sélectionnez Votre Date',
            chooseTime: 'Choisissez Votre Heure',
            importantInfo: 'Informations Importantes',
            weatherForecast: 'Prévisions Météo',
            selectDateToCheck: 'Sélectionnez une date pour vérifier la disponibilité',
            timeSlots: {
              morningDeparture: 'Départ matinal',
              afternoonDeparture: 'Départ après-midi',
              lateAfternoonDeparture: 'Départ fin d\'après-midi',
            },
            availability: {
              checkingAvailability: 'Vérification de la disponibilité...',
              fullyBooked: 'Complet',
              onlyXSpotsLeft: 'Seulement {{count}} places restantes',
              xSpotsAvailable: '{{count}} places disponibles',
            },
            weather: {
              partlyCloudy: 'Partiellement nuageux',
              chanceOfRain: '{{percent}}% de chance de pluie',
            },
            info: {
              bookingWindow: 'Fenêtre de Réservation:',
              bookingWindowDesc: 'Réservez au moins 24 heures à l\'avance, jusqu\'à {{days}} jours à l\'avance',
              freeCancellation: 'Annulation Gratuite:',
              freeCancellationDesc: 'Annulez jusqu\'à 24 heures avant votre aventure pour un remboursement complet',
              groupSize: 'Taille du Groupe:',
              groupSizeDesc: 'Maximum {{count}} participants par session',
              meetingPoint: 'Point de Rencontre:',
              meetingPointFallback: 'Les détails seront fournis après la réservation',
            },
            earlyBird: {
              title: 'Offre Spéciale Lève-tôt: {{percent}}% de Réduction!',
              description: 'Réservez {{days}} jours à l\'avance et économisez sur votre aventure',
            },
            duration: {
              hours: '{{count}} heures',
            },
          },
          step3: {
            headers: {
              leadGuestInformation: 'Informations Invité Principal',
              experienceLevel: 'Niveau d\'Expérience',
              dietaryRestrictions: 'Restrictions Alimentaires et Allergies',
              emergencyContact: 'Contact d\'Urgence',
              communicationPreferences: 'Préférences de Communication',
              adventureRequirements: 'Exigences de l\'Aventure',
              privacySecurity: 'Confidentialité et Sécurité',
            },
            descriptions: {
              leadGuest: 'Cette personne sera le contact principal pour cette réservation',
              experienceLevel: 'Aidez-nous à offrir la meilleure expérience selon votre niveau',
              dietary: 'Faites-nous savoir vos besoins alimentaires ou allergies',
              emergencyContact: 'Quelqu\'un que nous pouvons contacter en cas d\'urgence',
              communications: 'Comment souhaitez-vous recevoir les mises à jour de votre réservation?',
            },
            labels: {
              fullName: 'Nom Complet *',
              phoneNumber: 'Numéro de Téléphone *',
              emailAddress: 'Adresse Email *',
              pleaseSpecify: 'Veuillez préciser',
            },
            placeholders: {
              enterFullName: 'Entrez votre nom complet',
              phoneFormat: '+1 (555) 123-4567',
              emailFormat: 'votre@email.com',
              emergencyContactName: 'Nom du contact d\'urgence',
              dietaryNeeds: 'Veuillez décrire vos besoins alimentaires',
            },
            experienceLevels: {
              beginner: {
                label: 'Débutant',
                description: 'Première fois ou expérience très limitée',
              },
              intermediate: {
                label: 'Intermédiaire', 
                description: 'Quelque expérience avec des activités similaires',
              },
              advanced: {
                label: 'Avancé',
                description: 'Expérience étendue et confiant',
              },
              expert: {
                label: 'Expert',
                description: 'Niveau professionnel ou expérience étendue',
              },
            },
            dietary: {
              vegetarian: 'Végétarien',
              vegan: 'Végétalien',
              glutenFree: 'Sans gluten',
              dairyFree: 'Sans produits laitiers',
              nutAllergy: 'Allergie aux noix',
              shellfishAllergy: 'Allergie aux fruits de mer',
              other: 'Autre',
            },
            notifications: {
              email: 'Notifications par email',
              sms: 'Notifications par SMS',
              whatsapp: 'Notifications WhatsApp',
            },
            messages: {
              emailConfirmation: 'Nous enverrons les confirmations de réservation et mises à jour à cette adresse',
            },
            privacy: {
              secureDataProcessing: 'Traitement Sécurisé des Données:',
              secureDataDesc: 'Toutes les informations personnelles sont cryptées et stockées en sécurité',
              limitedDataUse: 'Utilisation Limitée des Données:',
              limitedDataDesc: 'Informations utilisées uniquement pour le traitement des réservations et support client',
              noSpamPolicy: 'Politique Anti-Spam:',
              noSpamDesc: 'Nous vous contacterons seulement concernant votre réservation sauf opt-in',
              privacyCompliant: 'Conforme à la Confidentialité:',
              privacyCompliantDesc: 'Conformité complète avec la Politique de Confidentialité et Conditions de Service',
            },
          },
          step4: {
            headers: {
              enhanceAdventure: 'Améliorez Votre Aventure',
              promoCode: 'Code Promo',
              specialRequests: 'Demandes Spéciales',
              popularCombinations: 'Combinaisons Populaires',
            },
            descriptions: {
              enhanceAdventure: 'Ajoutez des extras optionnels pour rendre votre expérience encore plus mémorable',
              specialRequests: 'Faites-nous savoir si vous avez des demandes spéciales ou informations supplémentaires',
              popularCombinations: 'Économisez avec ces forfaits groupés populaires',
            },
            addOns: {
              photos: {
                name: 'Photos Professionnelles',
                description: 'Obtenez des photos haute qualité de votre aventure prises par notre photographe professionnel',
                category: 'Photographie',
              },
              lunch: {
                name: 'Lunch Gourmet',
                description: 'Savourez un délicieux lunch de source locale avec options végétariennes disponibles',
                category: 'Nourriture et Boissons',
              },
              transport: {
                name: 'Ramassage à l\'Hôtel',
                description: 'Ramassage et dépôt pratique depuis votre hôtel dans les principales zones touristiques',
                category: 'Transport',
              },
              gear: {
                name: 'Amélioration Équipement Premium',
                description: 'Améliorez vers l\'équipement d\'aventure premium pour un confort et sécurité accrus',
                category: 'Équipement',
              },
              souvenir: {
                name: 'Pack Souvenir Aventure',
                description: 'Ramenez un t-shirt de marque, bouteille d\'eau et album photo',
                category: 'Souvenirs',
              },
            },
            combos: {
              memory: {
                name: 'Forfait Souvenir',
                description: 'Photos Professionnelles + Pack Souvenir = {{bundlePrice}}$ (Économisez {{savings}}$!)',
                badge: 'Choix le plus populaire pour les visiteurs première fois',
              },
              comfort: {
                name: 'Forfait Confort',
                description: 'Ramassage Hôtel + Lunch Gourmet = {{bundlePrice}}$ (Économisez {{savings}}$!)',
                badge: 'Parfait pour une expérience sans tracas',
              },
            },
            labels: {
              popular: 'Populaire',
              selectedAddOns: 'Extras Sélectionnés',
              addOnsTotal: 'Total Extras',
              selected: 'Sélectionné',
              additionalInfo: 'Informations Supplémentaires (Optionnel)',
            },
            placeholders: {
              promoCode: 'Entrez le code promo',
              specialRequests: 'ex: célébrer une occasion spéciale, considérations mobilité, besoins alimentaires spécifiques non mentionnés...',
            },
            buttons: {
              apply: 'Appliquer',
              checking: 'Vérification...',
            },
            messages: {
              enterPromoCode: 'Veuillez entrer un code promo',
              promoSuccess: 'Code promo appliqué avec succès!',
              promoInvalid: 'Code promo invalide ou expiré',
              promoApplied: 'Code promo "{{code}}" appliqué!',
              comboRemoved: '{{name}} retiré',
              comboSelectedWithReplace: '{{name}} sélectionné! Articles individuels remplacés: {{items}}. Vous économisez {{savings}}$!',
              comboAdded: '{{name}} ajouté! Vous économisez {{savings}}$!',
              accommodateRequests: 'Nous ferons de notre mieux pour accommoder vos demandes, bien que certaines ne soient pas possibles selon la disponibilité.',
            },
          },
          step5: {
            headers: {
              bookingSummary: 'Résumé de Réservation',
              priceBreakdown: 'Détail des Prix',
              paymentMethod: 'Méthode de Paiement',
              paymentPlanDetails: 'Détails Plan de Paiement',
              securityTrust: 'Sécurité et Confiance',
            },
            labels: {
              leadGuest: 'Invité Principal',
              addons: 'Extras',
              participant: 'participant',
              participants: 'participants',
              popular: 'Populaire',
              today: 'Aujourd\'hui',
              in1Month: 'Dans 1 mois',
              in2Months: 'Dans 2 mois',
            },
            paymentMethods: {
              card: {
                name: 'Carte de Crédit ou Débit',
                description: 'Visa, Mastercard, American Express',
              },
              applePay: {
                name: 'Apple Pay',
                description: 'Paiement rapide et sécurisé',
              },
              googlePay: {
                name: 'Google Pay',
                description: 'Payez avec votre compte Google',
              },
              paymentPlan: {
                name: 'Plan de Paiement',
                description: 'Payez en 3 versements mensuels',
              },
            },
            pricing: {
              groupDiscount: 'Remise groupe',
              earlyBirdDiscount: 'Remise lève-tôt',
              promoDiscount: 'Remise promo',
              addons: 'Extras',
              taxesFees: 'Taxes et frais',
              total: 'Total',
            },
            paymentPlan: {
              noInterestDescription: 'Aucun frais d\'intérêt. Paiements automatiques depuis votre méthode de paiement sélectionnée.',
            },
            security: {
              sslEncrypted: 'Paiement sécurisé crypté SSL',
              pciCompliant: 'Traitement conforme PCI DSS',
              instantConfirmation: 'Confirmation de réservation instantanée',
              freeCancellation: 'Annulation gratuite jusqu\'à 24 heures',
            },
            terms: {
              agreementText: 'J\'accepte les',
              termsOfService: 'Conditions de Service',
              privacyPolicy: 'Politique de Confidentialité',
              cancellationPolicy: 'Politique d\'Annulation',
              and: 'et',
              comma: ',',
              bookingSubjectText: '. Je comprends que cette réservation est sujette à disponibilité et confirmation.',
            },
            confirmation: {
              emailConfirmation: '• Vous recevrez un email de confirmation avec détails de réservation et code QR',
              teamContact: '• Notre équipe vous contactera 24 heures avant votre aventure avec les détails finaux',
              freeCancellation: '• Annulation gratuite jusqu\'à 24 heures avant votre aventure prévue',
            },
            buttons: {
              processingBooking: 'Traitement de votre réservation...',
              completeBooking: 'Compléter la Réservation',
            },
            messages: {
              redirectMessage: 'Vous serez redirigé vers notre processeur de paiement sécurisé',
            },
          },
        }
      }
    }
  });

export default i18n;