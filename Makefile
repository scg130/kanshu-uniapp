.PHONY: docker
docker: 
	docker build . --platform linux/amd64 -t scg130/kanshu-uniapp:latest

.PHONY: push
push: 
	docker push scg130/kanshu-uniapp