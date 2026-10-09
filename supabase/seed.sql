INSERT INTO artists (id, name) VALUES
    ('00000000-0000-0000-0000-000000000000', 'Housefires');

INSERT INTO songs (id, slug, title, artist, key, vocal_range, link, sheet, lyrics, keywords) VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        'build-my-life',
        'Build My Life',
        '00000000-0000-0000-0000-000000000000',
        'E',
        ARRAY['C#3', 'C#4'],
        'https://www.youtube.com/watch?v=G2bGxCJHnkM',
        $$
{section Intro}
[E] [A]
[E/G#] [A]
{/section}

{section Verse 1}
[E]_ Worthy of every [A]song we could ever sing
[E/G#]_ Worthy of all the [A]praise we could ever bring
[E]_ Worthy of every [A]breath we could ever breathe
We live for [E/G#]You [A]
{/section}

{section Verse 2}
[E]_ Jesus the name a-[A]bove every other name
[E/G#]_ Jesus the only [A]One who could ever save
[E]_ Worthy of every [A]breath we could ever breathe
We live for [E/G#]You
We live for [A]You
{/section}

{section Chorus}
[A]Holy, there is no one [F#m]like you
There is none be-[E]side you
Open up my [C#m]eyes in wonder
[A]Show me who You are and [F#m]fill me with Your heart
And [E]lead me in Your love to [C#m]those around me
{/section}

{goto Verse 1}
{goto Verse 2}
{goto Chorus #repeat=2}

{section Instrumental}
[A] [B] [C#m] [E/G#]
{/section}

{section Bridge #repeat=2}
[A]I will build my [B]life upon Your [C#m]love
It is a [E/G#]firm foundation
[A]I will put my [B]trust in You a[C#m]lone
And I will [E/G#]not be shaken
{/section}

{goto Chorus #repeat=2}
{goto Bridge}
        $$,
        $$
Worthy of every song we could ever sing
Worthy of all the praise we could ever bring
Worthy of every breath we could ever breathe
We live for You

Jesus the name a-bove every other name
Jesus the only One who could ever save
Worthy of every breath we could ever breathe
We live for You
We live for You

Holy, there is no one like you
There is none be-side you
Open up my eyes in wonder
Show me who You are and fill me with Your heart
And lead me in Your love to those around me

I will build my life upon Your love
It is a firm foundation
I will put my trust in You alone
And I will not be shaken
        $$,
        'worship devotion faith surrender praise holiness trust foundation spiritual transformation redemption grace gratitude adoration commitment discipleship purpose eternal values kingdom intimacy prayer consecration renewal dedication reverence love service mission'
    );

REFRESH MATERIALIZED VIEW CONCURRENTLY songs_search;
