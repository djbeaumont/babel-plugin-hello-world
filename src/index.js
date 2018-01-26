const nodejsPath = require('path')

module.exports = function ({ types: t }) {
	return {
		visitor: {
			ImportDeclaration (path, state) {
				// Change the function we import
				const source = path.node.source
				if (!source.value.includes('i18n') || path.node.isNew) return

				const newImport = t.importDeclaration(
					[t.importSpecifier(t.identifier('t'), t.identifier('localiseWithTranslations'))],
					t.stringLiteral(source.value)
				)
				newImport.isNew = true

				path.replaceWith(newImport)
			},

			CallExpression (path, state) {
				const callee = path.get('callee')
				if (callee.node.name !== 't' || path.node.isNew) return

				const availableTranslations = state.opts && state.opts.translations || {}
				const locales = Object.keys(availableTranslations)

				// Get the parameters to the translation call, including translation key and params
				const callArgs = path.get('arguments')
				const translationKey = callArgs[0]
				const translationParams = callArgs[1]
				const keyName = translationKey.node.value

				// Add variable declarations for individual translations to the top of the file
				const translationVariables = locales.map(locale => {
					const translationValue = require(availableTranslations[locale])[keyName]
					return t.variableDeclaration('const', [t.VariableDeclarator(
						t.identifier(`${keyName}_${locale}`),
						t.stringLiteral(translationValue)
					)])
				})
				translationVariables.forEach(translationVariable => {
					state.file.path.node.body.unshift(translationVariable)
				})

				// Replace function call with extra argument
				const translations = t.objectExpression(locales.map(locale => {
					return t.objectProperty(t.identifier(locale), t.identifier(`${keyName}_${locale}`))
				}))

				const newCall = t.CallExpression(t.identifier('t'), [translationKey.node, translations, translationParams.node])
				newCall.isNew = true

				path.replaceWith(newCall)
			}
		}
	}
}
