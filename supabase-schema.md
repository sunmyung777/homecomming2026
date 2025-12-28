# Supabase Database Schema for INSIDERS 창립제

## 테이블 생성 SQL

Supabase SQL Editor에서 아래 코드를 실행하세요.

```sql
-- 참가 신청 테이블 생성
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  batch VARCHAR(10) NOT NULL,
  school VARCHAR(20) NOT NULL CHECK (school IN ('YONSEI', 'KOREA')),
  is_sponsor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_registrations_school ON registrations(school);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- Row Level Security (RLS) 활성화
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 데이터를 삽입할 수 있도록 정책 생성
CREATE POLICY "Allow public insert" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- 모든 사용자가 통계 조회를 할 수 있도록 정책 생성
CREATE POLICY "Allow public select" ON registrations
  FOR SELECT
  USING (true);

-- 학교별 참가자 수를 반환하는 함수 생성
CREATE OR REPLACE FUNCTION get_school_stats()
RETURNS TABLE (
  school TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.school::TEXT, COUNT(*)::BIGINT
  FROM registrations r
  GROUP BY r.school;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **Settings > API**에서 URL과 anon key 복사
4. `.env` 파일에 붙여넣기
5. **SQL Editor**에서 위 SQL 실행
