-- =====================================================
-- Add French Translation Support to Blog System (SAFE VERSION)
-- =====================================================
-- This migration ONLY adds French translation columns
-- No table creation or policy changes to avoid conflicts

-- Add French translation columns to posts table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        -- Add French columns to posts
        ALTER TABLE posts 
        ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255),
        ADD COLUMN IF NOT EXISTS excerpt_fr TEXT,
        ADD COLUMN IF NOT EXISTS content_fr TEXT,
        ADD COLUMN IF NOT EXISTS meta_description_fr TEXT;
        
        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_posts_title_fr ON posts(title_fr);
        
        -- Add comments
        COMMENT ON COLUMN posts.title_fr IS 'French translation of the post title';
        COMMENT ON COLUMN posts.excerpt_fr IS 'French translation of the post excerpt';
        COMMENT ON COLUMN posts.content_fr IS 'French translation of the post content';
        COMMENT ON COLUMN posts.meta_description_fr IS 'French translation of the meta description';
        
        RAISE NOTICE 'Added French translation columns to posts table';
    ELSE
        RAISE NOTICE 'Posts table does not exist - skipping';
    END IF;
END $$;

-- Add French translation columns to categories table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        ALTER TABLE categories 
        ADD COLUMN IF NOT EXISTS name_fr VARCHAR(100),
        ADD COLUMN IF NOT EXISTS description_fr TEXT;
        
        CREATE INDEX IF NOT EXISTS idx_categories_name_fr ON categories(name_fr);
        
        COMMENT ON COLUMN categories.name_fr IS 'French translation of the category name';
        COMMENT ON COLUMN categories.description_fr IS 'French translation of the category description';
        
        RAISE NOTICE 'Added French translation columns to categories table';
    ELSE
        RAISE NOTICE 'Categories table does not exist - skipping';
    END IF;
END $$;

-- Add French translation columns to tags table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tags') THEN
        ALTER TABLE tags 
        ADD COLUMN IF NOT EXISTS name_fr VARCHAR(50);
        
        CREATE INDEX IF NOT EXISTS idx_tags_name_fr ON tags(name_fr);
        
        COMMENT ON COLUMN tags.name_fr IS 'French translation of the tag name';
        
        RAISE NOTICE 'Added French translation columns to tags table';
    ELSE
        RAISE NOTICE 'Tags table does not exist - skipping';
    END IF;
END $$;