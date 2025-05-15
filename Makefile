hooks:
	git config core.hooksPath .git-hooks || echo 'Not in a git repo'

psql-dev:
	PGPASSWORD=KqCQzyH2akGB9gQ4 \
	psql \
		--host=localhost \
		--port=5432 \
		--username=inventory-user \
		--dbname=inventory-production
