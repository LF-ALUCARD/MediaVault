CREATE DATABASE media_valt;

USE media_valt;

DROP TABLE IF EXISTS `tb_user`;
CREATE TABLE `tb_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `senha` varchar(255) DEFAULT NULL,
  `role` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`)
  );
  
DROP TABLE IF EXISTS `tb_arquivo`;
CREATE TABLE `tb_arquivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `tamanho` bigint NOT NULL,
  `tamanho_formatado` varchar(50) NOT NULL,
  `midia` longblob NOT NULL,
  `data_upload` date NOT NULL,
  `data_expiracao` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `dias_restantes` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `tb_arquivo_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tb_user` (`id`)
  );