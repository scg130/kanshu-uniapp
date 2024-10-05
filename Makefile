.PHONY: docker
docker: 
	docker build . -t scg130/kanshu-uniapp:latest

.PHONY: push
push: 
	docker push scg130/kanshu-uniapp