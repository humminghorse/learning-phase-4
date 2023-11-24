# 4. Replace Vercel Postgres with Supabase Postgre

## Issues found in the previous lecture
The monthly limit for Written Data in Vercel Postgres, which was used as the Database, was 256 MB, which was exceeded in one day.
![](images/2023-11-23-21-58-30.png)

Reference: Vercel Postgres Pricing

![](images/2023-11-23-22-00-36.png)

As it is, the data cannot be written and is useless, so let's replace Database with another service, Supabase.

## Create a project with Supabase
- Open the Storage tab of the Vercel project you created last time and click the Connect Store button.
![](images/2023-11-23-22-04-24.png)

- Click on Browse Database Integrations.

![](images/2023-11-23-22-05-05.png)

- Select Supabase.

![](images/2023-11-23-22-07-57.png)

- Click the Add Integration button.

![](images/2023-11-23-22-14-21.png)

- Select your Vercel project and click the Continue button.

![](images/2023-11-23-22-16-38.png)

- With All Projects selected, click the Continue button.

![](images/2023-11-23-22-17-21.png)

- Click the Add Integration button !

![](images/2023-11-23-22-18-02.png)

- Click Continue with GitHub.

![](images/2023-11-23-22-19-19.png)

- Click Authorize supabase.

![](images/2023-11-23-22-19-55.png)

- Click Start a new Supabase project →

![](images/2023-11-23-22-20-37.png)

- Click New project !

![](images/2023-11-23-22-22-05.png)

- Enter the following and click Create new project.
  - Name: LearningPhase
  - Database Password: Set by Generate a password (remember to leave a note)
  - Region: Northeast Asia(Tokyo)

![](images/2023-11-23-22-28-52.png)

Wait during this screen.

![](images/2023-11-23-22-30-16.png)

When this screen appears, the project creation is complete.
![](images/2023-11-23-22-31-15.png)

## Replace local app database with Supabase

- Settings > Database > Connection Pooling Custom Configuration > Connection string and click Copy.
![](images/2023-11-23-23-25-10.png)

- Open the previously developed app (learning-phase-4) in Visual Studio Code.
  - Click `File > Open Folder... ` and select `learning-phase-4` folder.
    ![Open Folder](images/1/2023-11-17-08-40-25.png)

- Paste the copied URI into the POSTGRES_PRISMA_URL value in the .env and replace `[YOUR-PASSWORD]` with the password you wrote down. Also, add `?pgbouncer=true&connect_timeout=15` to the end of the URI. Also, delete the other lines as they are unnecessary.
![](images/2023-11-23-23-27-55.png)

- Click Copy in Settings > Database > Connection string > URI.
![](images/2023-11-23-22-50-12.png)

- Add a line POSTGRES_URL_NON_POOLING to your .env, paste the copied URI into the value and replace `[YOUR-PASSWORD]` with the password you wrote down.
![](images/2023-11-23-23-03-12.png)

- Execute the following two commands.

```bash
npx prisma migrate dev --name init
```

```bash
npx prisma migrate reset
```

If the .env setting is correct but the command does not succeed, please check if your IP address is not registered in Supabase Settings > Database > Network Bans, and unban it if it is registered.

![](images/2023-11-23-23-15-11.png)

- In Supabase's Table Editor, you can confirm that the table has been created and the Seed data has been registered.
![](images/2023-11-23-23-38-57.png)

- Let's change the name of Pet in Supabase's Table Editor.
![](images/2023-11-23-23-43-15.png)

- The name is also changed in PrismaStudio, which is started by the following command. This means that the database has been replaced by Supabase.

```bash
npx prisma studio
```

![](images/2023-11-23-23-44-22.png)


## Replace the database of your Vercel app with Supabase
Next, let's replace the database of the app deployed in Vercel with Supabase.

- Reopen this screen and click the Resume Setup button (if you reopen it, it will be the Add Integration button).

![](images/2023-11-23-23-53-11.png)

- Select Vercel Project and Supabase Project and click Add Integration !
![](images/2023-11-23-23-57-46.png)

- Click on the Storage tab.
![](images/2023-11-24-00-01-06.png)

- Select learning-phase-4-postgres.
![](images/2023-11-24-00-17-07.png)

- Select Projects in the lower left corner and perform a Remove Project Connection to the learning-phase-4 project.
![](images/2023-11-24-00-17-34.png)

- Click Remove Connection.

![](images/2023-11-24-00-18-21.png)

- Open the Storage tab of the learning-phase-4 project and you will see that it is now unconnected to Vercel's Postgres.
![](images/2023-11-24-00-19-06.png)

- Open Settings > Environment Variables, add the following two environment variables with the same values as the local .env and click the Save button.
  - POSTGRES_PRISMA_URL
  - POSTGRES_URL_NON_POOLING
![](images/2023-11-24-00-22-55.png)

Next, run Deploy to reflect the environment variable changes in the app on Vercel.

- On the Deployments tab, under Latest Deployments, click on Redeploy.

![](images/2023-11-24-00-26-35.png)
- Click Redeploy.

![](images/2023-11-24-00-27-33.png)

- After deployment is complete, click on the Visit button !
![](images/2023-11-24-00-30-22.png)

- Add `/api/pets` to the end of your browser URL.

![](images/2023-11-24-00-31-17.png)

- You will see the pets with the names you changed in Supabase.

![](images/2023-11-24-00-31-38.png)

Now you have replaced the database of the application deployed in Vercel with Supabase.

Next [`Advanced API Development #5`](./5-advanced-api-development.md)
