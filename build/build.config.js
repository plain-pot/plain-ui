module.exports = {
    library: {
        name: 'plain-ui',
        exportName: 'PLAIN',
        packagePath: 'src/packages',
        output: 'dist',
    },
    scss: {
        globalImport: [
            'src/style/global-import.scss',
        ],
        importOnce: [
            'src/style/public.scss',
        ]
    },
}