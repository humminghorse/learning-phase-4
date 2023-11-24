# 5. API開発応用編
- 一覧取得APIに検索条件を入れる
- 認証
- 画像のアップロード

--- 最低限
- delete pets のweightへの外部キー制約の解消
- APIのカスタマイズ(ロジック追加)
- テーブル設計を考えてもらえるようなネタ

## 一覧取得APIに検索条件を入れる
https://github.com/naotakke/learning-phase-4/pull/1/files

## delete pets のweightへの外部キー制約の解消
TODO


## 認証
### Supabaseの認証機能を使う準備
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

これで。Supabaseの認証機能を使う準備ができました。

### Signup
まずは、Signupできるようにします。

- `src/app/api` 配下に `signup` フォルダを作成し、その中に `route.ts`というファイルを作成して、以下のコードを貼り付けてください。
```ts
import { NextResponse } from 'next/server'

import { supabase } from '../../../../lib/supabaseClient'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const data = await request.json()
  const email = String(data.email)
  const password = String(data.password)

  const authResponse = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  return NextResponse.json(authResponse)
}
```
![](images/2023-11-25-02-48-45.png)

- request.httpに以下を追記して、emailとpasswordの値を書き換えてから、SendRequestを実行してください。
```
### signup
POST {{baseUrl}}/signup HTTP/1.1
Content-Type: application/json

{
  "email": "<YOUR EMAIL ADDRESS>",
  "password": "<ANY PASSWORD>"
}
```
![](images/2023-11-25-02-55-40.png)

- 以下のようなResponseが表示されたらOKです。
![](images/2023-11-25-03-00-03.png)

- SupabaseでAuthentication > Usersを開くと、ユーザーが登録されていることが確認できます。
![](images/2023-11-25-03-00-38.png)

- 指定したメールアドレス宛に、Signupの確認を求めるメールが届きます。Confirm your mailをクリックしましょう。
![](images/2023-11-25-03-03-11.png)

- このような画面にリダイレクトされますが、アプリの画面を作っていないので、これでOKです。
![](images/2023-11-25-03-05-23.png)

- もう一度SupabaseでAuthentication > Usersを開くと、Last Sign Inの値が `Waiting for verification` から、メール内のConfirm your mailをクリックした日時に変わったことが確認できます。
![](images/2023-11-25-03-08-38.png)

### Signin
続いて、Signinできるようにします。

- `src/app/api` 配下に `signin` フォルダを作成し、その中に `route.ts`というファイルを作成して、以下のコードを貼り付けてください。
```ts
import { NextResponse } from 'next/server'

import { supabase } from '../../../../lib/supabaseClient'

export async function POST(request: Request) {
  const data = await request.json()
  const email = String(data.email)
  const password = String(data.password)

  const authTokenResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return NextResponse.json(authTokenResponse.data.session)
}
```
![](images/2023-11-25-03-27-36.png)

- request.httpに以下を追記して、emailとpasswordの値を書き換えてから、SendRequestを実行してください。
```
### signin
POST {{baseUrl}}/signin HTTP/1.1
Content-Type: application/json

{
  "email": "<YOUR EMAIL ADDRESS>",
  "password": "<ANY PASSWORD>"
}
```
![](images/2023-11-25-03-21-14.png)

- 以下のようなResponseが表示されたらOKです。
  - Responseに含まれるaccess_tokenには本人確認に必要な情報が含まれており、これを使って、認証済の状態であることの確認が行われます。
![](images/2023-11-25-03-28-36.png)


- 参考: access_tokenをデコードすることで、ユーザ情報を取得できます。
  - デコードができるサイト: https://jwt.io/
![](images/2023-11-25-04-05-07.png)

<!-- 本当は、AuthorizationヘッダーでBearerを受けとって、supabaseClientにセットしたい。ただ、フロントアプリを作ればそんなことしなくて良いので、無駄かも。 -->


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
