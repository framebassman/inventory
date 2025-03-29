build-web:
	npm install --prefix ./services/web --legacy-peer-deps
	npm run build --prefix ./services/web

deploy-web:
	npm run deploy --prefix ./services/web
