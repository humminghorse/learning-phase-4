# 4. 第4回で作ったアプリのDBをSupabaseに置き換え

## 前回の講義で分かった課題
Databaseとして利用していたVercel PostgresのWritten Dataの月間の上限が256MBで、それを1日で超えてしまっていました。
![](images/2023-11-23-21-58-30.png)

参考: Vercel Postgres Pricing
![](images/2023-11-23-22-00-36.png)

そのままではデータの書き込みができず、使い物にならないので、Databaseを別のサービスである、Supabaseに置き換えていきましょう。

## Supabaseでプロジェクトを作成
- 前回作成したVercelプロジェクトのStorageタブを開いて、Connect Storeボタンをクリックしてください。
![](images/2023-11-23-22-04-24.png)

- Browse Database Integrationsをクリックしてください。
![](images/2023-11-23-22-05-05.png)

- Supabaseを選択してください。
![](images/2023-11-23-22-07-57.png)

- Add Integrationボタンをクリックしてください。

![](images/2023-11-23-22-14-21.png)

- ご自身のVercelプロジェクトを選択して、Continueボタンをクリックしてください。
![](images/2023-11-23-22-16-38.png)

- All Projectsが選択されたまま、Continueボタンをクリックしてください。
![](images/2023-11-23-22-17-21.png)

- Add Integrationボタンをクリックしてください。
![](images/2023-11-23-22-18-02.png)

- Continue with GitHubをクリックしてください。
![](images/2023-11-23-22-19-19.png)

- Authorize supabaseをクリックしてください。
![](images/2023-11-23-22-19-55.png)

- Start a new Supabase project → をクリックしてください。
![](images/2023-11-23-22-20-37.png)

- New projectをクリックしてください。
![](images/2023-11-23-22-22-05.png)

- 以下を入力して、Create new projectをクリックしてください。
  - Name: LearningPhase
  - Database Password: Generate a passwordで設定(メモを残すことを忘れずに)
  - Region: Northeast Asia(Tokyo)

![](images/2023-11-23-22-28-52.png)

この画面の間は待ちましょう。
![](images/2023-11-23-22-30-16.png)

この画面が表示されたら、プロジェクトの作成は完了です。
![](images/2023-11-23-22-31-15.png)

## ローカルアプリのデータベースをSupabaseに置き換え

- Settings > Database > Connection Pooling Custom Configuration > Connection stringでCopyをクリックしてください。
![](images/2023-11-23-23-25-10.png)

- Visual Studio Codeで前回開発したアプリ(learning-phase-4)を開いてください。
  - Click `File > Open Folder...` and select `learning-phase-4` folder.
    ![Open Folder](images/1/2023-11-17-08-40-25.png)

- .envのPOSTGRES_PRISMA_URLの値にコピーしたURIを貼り付けて、`[YOUR-PASSWORD]` をメモしておいたパスワードに置き換えてください。また、URIの末尾に`?pgbouncer=true&connect_timeout=15`を追加してください。また、その他の行は不要なので、削除してください。
![](images/2023-11-23-23-27-55.png)

- Settings > Database > Connection string > URI でCopyをクリックしてください。
![](images/2023-11-23-22-50-12.png)

- .envにPOSTGRES_URL_NON_POOLINGの行を追加し、値にコピーしたURIを貼り付けて、`[YOUR-PASSWORD]` をメモしておいたパスワードに置き換えてください。
![](images/2023-11-23-23-03-12.png)

- 以下2つのコマンドを実行してください。

```bash
npx prisma migrate dev --name init
```
```bash
npx prisma migrate reset
```

※ .envの設定が正しくてもコマンドが成功しない場合、SupabaseのSettings > Database > Network Bansにご自身のIPアドレスが登録されていないかを確認して、もし登録されていればUnbanしてください。

![](images/2023-11-23-23-15-11.png)

- SupabaseのTable Editorで、テーブルが作成され、Seedデータが登録されたことが確認できます。
![](images/2023-11-23-23-38-57.png)

- SupabaseのTable Editorで、Petのnameを変更してみましょう。
![](images/2023-11-23-23-43-15.png)

- 以下のコマンドで起動するPrismaStudioでもnameが変更されており、データベースがSupabaseに置き換えられたことが確認できます。
```bash
npx prisma studio
```
![](images/2023-11-23-23-44-22.png)


## VercelアプリのデータベースをSupabaseに置き換え
続いて、VercelにデプロイしたアプリのデータベースをSupabaseに置き換えましょう。

- この画面を再度開いて、Resume Setupボタンをクリック(開き直した場合は、Add Integrationボタンになります)

![](images/2023-11-23-23-53-11.png)

- Vercel Project と Supabase Projectを選択して、Add Integrationをクリックしてください。
![](images/2023-11-23-23-57-46.png)

- Storageタブをクリックしてください。
![](images/2023-11-24-00-01-06.png)

- learning-phase-4-postgresを選択してください。
![](images/2023-11-24-00-17-07.png)

- 左下のProjectsを選択し、learning-phase-4プロジェクトに対してRemove Project Connectionを実行してください。
![](images/2023-11-24-00-17-34.png)

- Remove Connectionをクリックしてください。
![](images/2023-11-24-00-18-21.png)

- learning-phase-4プロジェクトのStorageタブを開くと、VercelのPostgresと未接続の状態になったことが確認できます。
![](images/2023-11-24-00-19-06.png)

- Settings > Environment Variablesを開き、以下2つの環境変数をローカルの.envと同じ値で追加して、Saveボタンをクリックしてください。
  - POSTGRES_PRISMA_URL
  - POSTGRES_URL_NON_POOLING
![](images/2023-11-24-00-22-55.png)

続いて、環境変数の変更をVercel上のアプリに反映するために、デプロイを実行します。

- Deploymentsタブの最新のデプロイで、Redeployをクリックしてください。
![](images/2023-11-24-00-26-35.png)
- Redeployをクリックしてください。

![](images/2023-11-24-00-27-33.png)
- デプロイ完了後、Visitボタンをクリックしてください。
![](images/2023-11-24-00-30-22.png)
- ブラウザのURLの末尾に `/api/pets` を追加しましょう。
![](images/2023-11-24-00-31-17.png)
- Supabaseで変更した名前のペットが表示されます。
![](images/2023-11-24-00-31-38.png)

これで、VercelにデプロイしたアプリのデータベースをSupabaseに置き換えられました。

Next [`Advanced API Development #5`](./5-advanced-api-development.md)
