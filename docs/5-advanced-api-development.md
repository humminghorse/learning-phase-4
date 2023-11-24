# 5. API開発応用編

## 一覧取得APIに検索条件を入れる
https://github.com/naotakke/learning-phase-4/pull/1/files


## 認証
Supabaseを使って認証機能を実装しましょう。

### Supabaseの認証機能を使う準備
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

```
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

```
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

```
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


## ファイルのアップロード
画像ファイルをアップロードできるAPIを作成しましょう。

### バケット(ファイルの保存先)の作成
- Supabaseで Storage > New Bucketを選択してください。
![](images/2023-11-24-10-00-33.png)

- Name of bucketに `learning-phase`と入力し、Public bucketをONにしてSaveしてください。

![](images/2023-11-24-10-02-06.png)

### ポリシー設定
初期状態ではセキュリティ設定でファイルアップロードができないので、許可設定を追加します。

- Policiesを開き、learning-phaseの右のNewPolicyボタンをクリックしてください。
![](images/2023-11-24-10-04-36.png)

- For full customizationを選択してください。
![](images/2023-11-24-10-05-10.png)

- 以下のように設定してください
  - Policy name: allow-all
  - Allowed operation: SELECT, INSERT, UPDATE, DELETE
  - Target roles: Default
  - Policy definition: Default

![](images/2023-11-25-04-37-27.png)


### 画像アップロードAPI
- `src/app/api` 配下に `images` フォルダを作成し、その中に `route.ts`というファイルを作成して、以下のコードを貼り付けてください。

```
import { NextResponse } from 'next/server'

import { supabase } from '../../../../lib/supabaseClient'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  const response = await supabase.storage
    .from('learning-phase') // target bucket name
    .upload(file.name, file)

  return NextResponse.json(response)
}
```

![](images/2023-11-25-05-50-29.png)

- imagesフォルダを作成し、アップロードする画像を保存してください。どんな画像でもOKです。
![](images/2023-11-25-05-58-50.png)

- request.httpに以下を追記して、<YOUR FILE NAME>と <YOUR FILE PATH>の値を書き換えてから、SendRequestを実行してください。

```
### upload image
POST {{baseUrl}}/images HTTP/1.1
Content-Type: multipart/form-data; boundary=MyBoundary

--MyBoundary
Content-Disposition: form-data; name="file"; filename="<YOUR FILE NAME>"
Content-Type: image/jpeg

< <YOUR FILE PATH>
--MyBoundary--
```

![](images/2023-11-25-06-01-23.png)

- 以下のようなResponseが表示されたらOKです。
![](images/2023-11-25-06-04-35.png)

- Supabaseのlearning-phaseバケットの中に画像が保存されていることが確認できます。
![](images/2023-11-25-06-05-03.png)

### 演習: 画像の一覧取得API
こちらのlistメソッドを使ってlearning-phaseバケットのファイル一覧を取得取得するAPIを作成してみましょう。
https://supabase.com/docs/reference/javascript/storage-from-list

![](images/2023-11-25-06-24-20.png)

ヒント: listメソッドに渡すParametersは全てOptionalなので、省略して `list()` としてOKです。

## Vercel上のアプリへの反映
変更のCommit, Pushをしておきましょう。そうすることで、Vercel上のアプリにも反映をしておきましょう。
(やり方を忘れた人は、第4回レクチャーの資料を参考にしてください。)


