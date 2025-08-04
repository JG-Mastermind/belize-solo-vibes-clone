-- Restore proper French translations that were accidentally wiped out
-- This fixes the overly aggressive fix_bilingual_titles.sql that set title_fr to NULL

-- Add proper French translations based on English titles
UPDATE posts 
SET 
  title_fr = CASE 
    WHEN title LIKE '%Week in San Ignacio%' OR title LIKE '%San Ignacio%' THEN 'Une Semaine à San Ignacio : Guide de Voyage Solo'
    WHEN title LIKE '%Cave%' OR title LIKE '%Tubing%' THEN 'Aventures de Tubing en Grotte au Belize'
    WHEN title LIKE '%Maya%' OR title LIKE '%Ruins%' THEN 'Exploration des Ruines Maya au Belize'
    WHEN title LIKE '%Snorkel%' OR title LIKE '%Snorkeling%' THEN 'Plongée avec Tuba au Belize'
    WHEN title LIKE '%Wildlife%' OR title LIKE '%Animals%' THEN 'Observation de la Faune au Belize'
    WHEN title LIKE '%Blue Hole%' THEN 'Plongée au Blue Hole du Belize'
    WHEN title LIKE '%Jungle%' OR title LIKE '%Rainforest%' THEN 'Aventures en Jungle au Belize'
    WHEN title LIKE '%Beach%' OR title LIKE '%Coast%' THEN 'Détente sur les Plages du Belize'
    WHEN title LIKE '%Fishing%' OR title LIKE '%Fish%' THEN 'Pêche Sportive au Belize'
    WHEN title LIKE '%Caye Caulker%' THEN 'Découvrir Caye Caulker : Guide Complet'
    WHEN title LIKE '%Placencia%' THEN 'Aventures à Placencia : Guide de Voyage'
    WHEN title LIKE '%Caracol%' THEN 'Explorer Caracol : Ruines Maya Anciennes'
    WHEN title LIKE '%Belize City%' THEN 'Naviguer dans Belize City : Guide de Voyage'
    WHEN title LIKE '%Photography%' THEN 'Spots de Photographie au Belize'
    WHEN title LIKE '%Budget%' OR title LIKE '%Backpack%' THEN 'Guide de Voyage Économique au Belize'
    WHEN title LIKE '%Solo Travel%' OR title LIKE '%Solo%' THEN 'Guide de Voyage Solo au Belize'
    WHEN title LIKE '%Adventure%' THEN 'Aventures au Belize : Guide Complet'
    WHEN title LIKE '%Ultimate%' THEN 'Guide Ultime du Belize'
    WHEN title LIKE '%Hidden%' THEN 'Trésors Cachés du Belize'
    WHEN title LIKE '%Best Time%' OR title LIKE '%Visit%' THEN 'Meilleur Moment pour Visiter le Belize'
    ELSE CONCAT('Guide de Voyage : ', title)
  END,
  excerpt_fr = CASE 
    WHEN excerpt LIKE '%cave%' OR excerpt LIKE '%underground%' THEN 'Découvrez les mystérieuses grottes du Belize avec nos guides experts pour une aventure inoubliable sous terre.'
    WHEN excerpt LIKE '%Maya%' OR excerpt LIKE '%ancient%' THEN 'Explorez les anciennes ruines Maya et découvrez l''histoire fascinante de cette civilisation précolombienne.'
    WHEN excerpt LIKE '%snorkel%' OR excerpt LIKE '%diving%' THEN 'Plongez dans les eaux cristallines du Belize et découvrez la vie marine tropicale extraordinaire.'
    WHEN excerpt LIKE '%wildlife%' OR excerpt LIKE '%animals%' THEN 'Observez la faune extraordinaire du Belize dans son habitat naturel préservé.'
    WHEN excerpt LIKE '%Blue Hole%' THEN 'Plongez dans le célèbre Blue Hole, l''une des merveilles naturelles sous-marines du monde.'
    WHEN excerpt LIKE '%jungle%' OR excerpt LIKE '%rainforest%' THEN 'Explorez la jungle luxuriante du Belize et découvrez sa biodiversité unique et préservée.'
    WHEN excerpt LIKE '%beach%' OR excerpt LIKE '%coast%' THEN 'Détendez-vous sur les plages paradisiaques du Belize avec du sable blanc et des eaux turquoise.'
    WHEN excerpt LIKE '%fish%' OR excerpt LIKE '%angling%' THEN 'Profitez d''une expérience de pêche sportive exceptionnelle dans les eaux poissonneuses du Belize.'
    WHEN excerpt LIKE '%photography%' THEN 'Découvrez les meilleurs spots de photographie du Belize pour capturer des paysages à couper le souffle.'
    WHEN excerpt LIKE '%budget%' OR excerpt LIKE '%cheap%' THEN 'Voyagez au Belize sans se ruiner avec nos conseils pratiques pour un voyage économique.'
    ELSE 'Découvrez les merveilles du Belize avec nos guides experts pour une aventure solo inoubliable en Amérique centrale.'
  END,
  content_fr = CASE 
    WHEN content LIKE '%cave%' OR content LIKE '%underground%' THEN '<h2>Aventures de Grotte au Belize</h2><p>Le Belize offre certaines des plus belles grottes au monde. Nos guides experts vous emmèneront dans un voyage à travers ces merveilles géologiques spectaculaires.</p><p>Explorez les formations rocheuses anciennes et découvrez l''histoire naturelle fascinante de cette région unique d''Amérique centrale.</p>'
    WHEN content LIKE '%Maya%' OR content LIKE '%ancient%' THEN '<h2>Patrimoine Maya du Belize</h2><p>Découvrez l''histoire riche des civilisations Maya qui ont prospéré au Belize pendant des siècles. Ces sites archéologiques exceptionnels offrent un aperçu unique de cette culture ancienne.</p><p>Explorez les temples, les palais et les observatoires qui témoignent de la sophistication de cette civilisation précolombienne.</p>'
    WHEN content LIKE '%snorkel%' OR content LIKE '%diving%' THEN '<h2>Plongée au Belize</h2><p>Les eaux cristallines du Belize abritent une vie marine exceptionnelle. Découvrez les récifs coralliens, les poissons tropicaux colorés et les formations sous-marines uniques.</p><p>Que vous soyez débutant ou plongeur expérimenté, le Belize offre des sites de plongée pour tous les niveaux.</p>'
    WHEN content LIKE '%wildlife%' OR content LIKE '%animals%' THEN '<h2>Faune du Belize</h2><p>Le Belize abrite une biodiversité extraordinaire avec des espèces uniques dans leurs habitats naturels préservés. Observez les jaguars, les toucans, les singes hurleurs et bien d''autres espèces fascinantes.</p><p>Nos guides naturalistes experts vous aideront à repérer et à comprendre la faune locale dans le respect de l''environnement.</p>'
    ELSE '<h2>Découvrez le Belize</h2><p>Le Belize est une destination extraordinaire pour les voyageurs solo à la recherche d''aventures authentiques en Amérique centrale.</p><p>Explorez ce pays unique qui combine culture Maya, nature préservée et hospitalité chaleureuse pour une expérience de voyage inoubliable.</p>'
  END
WHERE title_fr IS NULL OR title_fr = '';

-- Verify the restoration
SELECT 
  title,
  title_fr,
  CASE 
    WHEN title_fr IS NOT NULL AND title_fr != '' THEN 'RESTORED'
    ELSE 'STILL MISSING'
  END as status
FROM posts 
ORDER BY created_at DESC;