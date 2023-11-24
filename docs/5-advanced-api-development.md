# 5. API開発応用編
- 一覧取得APIに検索条件を入れる
- delete pets のweightへの外部キー制約の解消
- 認証
- 画像のアップロード
- APIのカスタマイズ(ロジック追加)
- テーブル設計を考えてもらえるようなネタ

## 一覧取得APIに検索条件を入れる
https://github.com/naotakke/learning-phase-4/pull/1/files

## delete pets のweightへの外部キー制約の解消
TODO


## 認証
<!-- 話題のSupabaseでサクッと認証機能をつくってみた！: https://qiita.com/kaho_eng/items/cb8d735b5b6ca1b3a6c5 -->

<!-- Supabase Auth with the Next.js App Router: https://supabase.com/docs/guides/auth/auth-helpers/nextjs?language=ts#server-side -->

<!-- Supabase Auth のユーザー情報を操作する方法: https://zenn.dev/matken/articles/use-user-info-with-supabase -->

- Supabaseで Project Settings > API を開き、Project URLとProject API key(anon public)をコピーする
![](images/2023-11-25-02-06-02.png)
- Visual Studio Codeで.envを開き、以下2行を追加する
```
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Project API key(anon public)>
```
![](images/2023-11-24-10-51-23.png)

- 認証用にSupabaseのライブラリをインストール
```bash
npm install @supabase/supabase-js
```

- `lib` フォルダの配下に `supabaseClient.ts`というファイルを追加し、以下のコードをコピーする。
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('')
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
![](images/2023-11-25-02-29-52.png)

-

## 画像のアップロード
<!-- Supabaseストレージに画像をアップロードし、表示する: https://qiita.com/dshukertjr/items/05437bb88bc7ae8583b8 -->
<!-- 話題のSupabaseでサクッと画像投稿機能をつくってみた！: https://qiita.com/kaho_eng/items/84df0ccfdc0ab5b8eb83 -->

<!-- Next.JS の API Route でのファイルアップロード受信処理: https://qiita.com/migimatsu/items/3fabebdaf087ee120859 -->

- New Bucket
![](images/2023-11-24-10-00-33.png)

- Public bucketをONにしてSave
![](images/2023-11-24-10-02-06.png)

- Other policies under storage.objects
![](images/2023-11-24-10-04-36.png)

- Get started quickly
![](images/2023-11-24-10-05-10.png)

-

---
```bash
npm install formidable
```

## APIのカスタマイズ(ロジック追加)
TODO

## テーブル設計を考えてもらえるようなネタ
TODO
