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
{start_of_verse: Intro}
[E] [A]
[E/G#] [A]
{end_of_verse}

{start_of_verse: Verse 1}
[E] <strut w="1em"/> Worthy of every [A]song we could ever sing
[E/G#] <strut w="1em"/> Worthy of all the [A]praise we could ever bring
[E] <strut w="1em"/> Worthy of every [A]breath we could ever breathe
We live for [E/G#]You [A]
{end_of_verse}

{start_of_verse: Verse 2}
[E] <strut w="1em"/> Jesus the name a[A]bove every other name
[E/G#] <strut w="1em"/> Jesus the only [A]One who could ever save
[E] <strut w="1em"/> Worthy of every [A]breath we could ever breathe
We live for [E/G#]You
We live for [A]You
{end_of_verse}

{start_of_chorus: Chorus}
[A]Holy, there is no one [F#m]like you
There is none be[E]side you
Open up my [C#m]eyes in wonder
[A]Show me who You are and [F#m]fill me with Your heart
And [E]lead me in Your love to [C#m]those around me
{end_of_chorus}

{comment: Verse 1}
{comment: Verse 2}
{comment: Chorus (2x)}

{start_of_verse: Instrumental}
[A] [B] [C#m] [E/G#]
{end_of_verse}

{start_of_bridge: Bridge (2x)}
[A]I will build my [B]life upon Your [C#m]love
It is a [E/G#]firm foundation
[A]I will put my [B]trust in You a[C#m]lone
And I will [E/G#]not be shaken
{end_of_bridge}

{comment: Chorus (2x)}
{comment: Bridge}
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
