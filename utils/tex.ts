const REPLACE_TABLE = `
\\dashfillcolor	gray
\\domsubgridwidth	0.25pt
\\domsubgridcolor	lightgray
\\domgridwidth	0.75pt
\\domgridcolor	darkgray
\\domlinewidth	1.25pt
\\domlinecolor	black
\\domaxewidth	1pt
\\domaxecolor	black
\\domfigurewidth	1.25pt
\\domfigurecolor	black
\\domfigurefill	lightgray
\\domsolidewidth	1.25pt
\\domsolidecolor	black
\\domsolidefill	lightgray
\\domtableaucolor	black
\\domtableauwidth	1.25pt
\\domtableaufill	lightgray
\\txtbox	\\ovalnum`.trim().split('\n').map(line => line.split('\t'));

export function migrateTex(tex: string) {
        for (const [old, new_] of REPLACE_TABLE) {
        const escaped = old.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        tex = tex.replace(new RegExp(escaped, 'g'), new_);
    }
    return tex;
}

/**
 * Ensure that the action is idempotent.
 */
export function safeMigrateTex(tex: string) {
    const migrated = migrateTex(tex);
    if (migrateTex(migrated) !== migrated) {
        throw new Error('migrateTex is not idempotent');
    }
    return migrated;
}
