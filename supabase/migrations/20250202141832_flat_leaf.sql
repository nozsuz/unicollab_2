/*
  # 研究者探索機能のスキーマ

  1. 新規テーブル
    - `researcher_profiles`
      - 研究者の詳細プロフィール情報
      - 論文、特許、研究実績などを含む
    - `research_keywords`
      - 研究キーワードのマスターテーブル
    - `researcher_keywords`
      - 研究者とキーワードの関連付け
    - `researcher_publications`
      - 研究者の論文情報
    - `researcher_patents`
      - 研究者の特許情報
    - `researcher_achievements`
      - 研究者の研究実績

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - 公開情報は誰でも閲覧可能
    - 研究者本人のみが自身の情報を編集可能

  3. インデックス
    - 検索性能向上のための適切なインデックスを設定
*/

-- 研究者プロフィールテーブル
CREATE TABLE researcher_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  title text NOT NULL,
  institution text NOT NULL,
  department text NOT NULL,
  field text NOT NULL,
  specialization text NOT NULL,
  research_summary text,
  education text[],
  experience text[],
  awards text[],
  contact_email text,
  website_url text,
  social_links jsonb,
  citation_metrics jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT researcher_profiles_user_id_key UNIQUE (user_id)
);

-- 研究キーワードマスターテーブル
CREATE TABLE research_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT research_keywords_keyword_key UNIQUE (keyword)
);

-- 研究者-キーワード関連テーブル
CREATE TABLE researcher_keywords (
  researcher_id uuid REFERENCES researcher_profiles(id) ON DELETE CASCADE,
  keyword_id uuid REFERENCES research_keywords(id) ON DELETE CASCADE,
  relevance_score float CHECK (relevance_score >= 0 AND relevance_score <= 1),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (researcher_id, keyword_id)
);

-- 論文情報テーブル
CREATE TABLE researcher_publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  researcher_id uuid REFERENCES researcher_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  authors text[] NOT NULL,
  journal text NOT NULL,
  publication_date date NOT NULL,
  doi text,
  citation_count int DEFAULT 0,
  abstract text,
  keywords text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 特許情報テーブル
CREATE TABLE researcher_patents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  researcher_id uuid REFERENCES researcher_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  patent_number text NOT NULL,
  filing_date date NOT NULL,
  grant_date date,
  inventors text[] NOT NULL,
  assignee text,
  abstract text,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 研究実績テーブル
CREATE TABLE researcher_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  researcher_id uuid REFERENCES researcher_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  achievement_date date,
  category text NOT NULL,
  impact_factor float,
  supporting_documents jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- インデックスの作成
CREATE INDEX researcher_profiles_field_idx ON researcher_profiles(field);
CREATE INDEX researcher_profiles_specialization_idx ON researcher_profiles(specialization);
CREATE INDEX research_keywords_keyword_idx ON research_keywords(keyword);
CREATE INDEX research_keywords_category_idx ON research_keywords(category);
CREATE INDEX researcher_publications_title_idx ON researcher_publications USING gin(to_tsvector('english', title));
CREATE INDEX researcher_publications_abstract_idx ON researcher_publications USING gin(to_tsvector('english', abstract));
CREATE INDEX researcher_patents_title_idx ON researcher_patents USING gin(to_tsvector('english', title));
CREATE INDEX researcher_patents_abstract_idx ON researcher_patents USING gin(to_tsvector('english', abstract));

-- RLSの設定
ALTER TABLE researcher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE researcher_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE researcher_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE researcher_patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE researcher_achievements ENABLE ROW LEVEL SECURITY;

-- 公開データの閲覧ポリシー
CREATE POLICY "Anyone can view researcher profiles"
  ON researcher_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view research keywords"
  ON research_keywords FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view researcher keywords"
  ON researcher_keywords FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view publications"
  ON researcher_publications FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view patents"
  ON researcher_patents FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view achievements"
  ON researcher_achievements FOR SELECT
  TO public
  USING (true);

-- 研究者による編集ポリシー
CREATE POLICY "Researchers can manage their own profile"
  ON researcher_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Researchers can manage their own keywords"
  ON researcher_keywords
  FOR ALL
  TO authenticated
  USING (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Researchers can manage their own publications"
  ON researcher_publications
  FOR ALL
  TO authenticated
  USING (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Researchers can manage their own patents"
  ON researcher_patents
  FOR ALL
  TO authenticated
  USING (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Researchers can manage their own achievements"
  ON researcher_achievements
  FOR ALL
  TO authenticated
  USING (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (researcher_id IN (
    SELECT id FROM researcher_profiles WHERE user_id = auth.uid()
  ));

-- 更新日時の自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_researcher_profiles_updated_at
  BEFORE UPDATE ON researcher_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_researcher_publications_updated_at
  BEFORE UPDATE ON researcher_publications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_researcher_patents_updated_at
  BEFORE UPDATE ON researcher_patents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_researcher_achievements_updated_at
  BEFORE UPDATE ON researcher_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();