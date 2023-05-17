.PHONY: up
up:
	docker-compose up -d

.PHONEY: down
down:
	docker-compose down

.PHONEY: remove_image
remove_image:
	docker rmi $(docker images -a -q)

.PHONEY: remove_val
remove_val:
	docker volume prune