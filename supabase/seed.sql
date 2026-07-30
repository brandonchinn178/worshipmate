INSERT INTO artists (id, name) VALUES
    ('00000000-0000-0000-0000-000000000000', 'Matt Redman'),
    ('00000000-0000-0000-0000-000000000001', 'Housefires'),
    ('00000000-0000-0000-0000-000000000002', 'Bethel Music'),
    ('00000000-0000-0000-0000-000000000003', 'All Sons and Daughters'),
    ('00000000-0000-0000-0000-000000000004', 'Maverick City Music');

INSERT INTO songs (id, slug, title, artist, key, sheet) VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        'blessed-be-your-name',
        'Blessed Be Your Name',
        '00000000-0000-0000-0000-000000000000',
        'A',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'build-my-life',
        'Build My Life',
        '00000000-0000-0000-0000-000000000001',
        'E',
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
[E]_ Jesus the name a[A]bove every other name
[E/G#]_ Jesus the only [A]One who could ever save
[E]_ Worthy of every [A]breath we could ever breathe
We live for [E/G#]You
We live for [A]You
{/section}

{section Chorus}
[A]Holy, there is no one [F#m]like you
There is none be[E]side you
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
        $$
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'ever-be',
        'Ever Be',
        '00000000-0000-0000-0000-000000000002',
        'E',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'great-are-you-lord',
        'Great Are You Lord',
        '00000000-0000-0000-0000-000000000003',
        'A',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'jireh',
        'Jireh',
        '00000000-0000-0000-0000-000000000004',
        'A',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'man-of-your-word',
        'Man of Your Word',
        '00000000-0000-0000-0000-000000000004',
        'A',
        ''
    );
