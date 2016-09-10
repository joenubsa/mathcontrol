-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-09-2016 a las 00:20:19
-- Versión del servidor: 5.6.24
-- Versión de PHP: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `math`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo`
--

CREATE TABLE IF NOT EXISTS `articulo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `descripcion` text,
  `fechaRegsitro` datetime DEFAULT NULL,
  `modulo_id` int(11) NOT NULL,
  `articulo_id` int(11) DEFAULT NULL,
  `params` text,
  `estado` varchar(1) DEFAULT NULL COMMENT '(A)ctivo\n(I)nactivo',
  `fechaRegistro` datetime DEFAULT NULL,
  `mostrarControl` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='Cabecera del Articulo.\n\nPertenece a Modulo\n\nModulo\n  |- Articulo';

--
-- Volcado de datos para la tabla `articulo`
--

INSERT INTO `articulo` (`id`, `nombre`, `descripcion`, `fechaRegsitro`, `modulo_id`, `articulo_id`, `params`, `estado`, `fechaRegistro`, `mostrarControl`) VALUES
(1, 'ARTICULO A', 'desc2', NULL, 1, NULL, NULL, 'A', '2016-08-28 14:43:46', 0),
(3, 'ARTICULO B', 'ssdf', NULL, 1, NULL, NULL, 'A', '2016-08-28 15:53:52', 1),
(4, 'ARTICULO C', 'desc2', NULL, 1, 3, NULL, 'A', '2016-08-28 14:43:46', 1),
(5, 'ARTICULO D', 'desc2', NULL, 1, 1, NULL, 'A', '2016-08-28 14:43:46', 1),
(6, 'ARTICULO E', 'ssdf', NULL, 1, 1, NULL, 'A', '2016-08-28 15:53:52', 1),
(7, 'ARTICULO G', 'desc2', NULL, 1, 3, NULL, 'A', '2016-08-28 14:43:46', 1),
(8, 'ARTICULO H', 'desc2', NULL, 1, 7, NULL, 'A', '2016-08-28 14:43:46', 1),
(9, 'ARTICULO I', 'ssdf', NULL, 1, 5, NULL, 'A', '2016-08-28 15:53:52', 1),
(10, 'ARTICULO J', 'desc2', NULL, 1, 3, NULL, 'A', '2016-08-28 14:43:46', 1),
(11, 'ARTICULO K', 'desc2', NULL, 1, 5, NULL, 'A', '2016-08-28 14:43:46', 1),
(12, 'ARTICULO L', 'ssdf', NULL, 1, 12, NULL, 'A', '2016-08-28 15:53:52', 1),
(13, 'ARTICULO M', 'desc2', NULL, 1, 12, NULL, 'A', '2016-08-28 14:43:46', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuestionario`
--

CREATE TABLE IF NOT EXISTS `cuestionario` (
  `id` int(11) NOT NULL,
  `descripcion` text,
  `cuerpo` text COMMENT 'colección de preguntas json',
  `respuestaCorrecta` varchar(1) DEFAULT NULL,
  `estado` varchar(1) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `articulo_id` int(11) NOT NULL,
  `tiempoMaximo` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='Cabecera del cuestionario.\n\nModulo\n  |-Articulo\n   |-Cuestionario';

--
-- Volcado de datos para la tabla `cuestionario`
--

INSERT INTO `cuestionario` (`id`, `descripcion`, `cuerpo`, `respuestaCorrecta`, `estado`, `fechaRegistro`, `articulo_id`, `tiempoMaximo`) VALUES
(7, 'La siguiente prueba consta de 10 preguntas de selecciÃ³n mÃºltiple con Ãºnica respuesta, sobre los conocimientos previos que debes tener: operaciones y problemas con nÃºmeros racionales, para la cual tienes un tiempo de 1 hora.\r\nConcÃ©ntrate bien en cada pregunta, lÃ©ela bien, esfuÃ©rzate por resolverla de la mejor manera, confÃ­a en tus capacidades, cree en tÃ­.\r\n', '1', '1', 'A', '2016-09-04 04:36:46', 1, NULL),
(8, 'Pregunta de prueba', '[{"id":"1","texto":"asdfdfa","respuestas":[{"id":"A","texto":"asdfdfa","correcta":false},{"id":"B","texto":"asdfdfa","correcta":false},{"id":"C","texto":"asdfdfa","correcta":true},{"id":"D","texto":"asdfdfa","correcta":false}]},{"id":"2","texto":"asdfdfa","respuestas":[{"id":"A","texto":"sdfadfw","correcta":false},{"id":"B","texto":"sdfadfw","correcta":false},{"id":"C","texto":"sdfadfw","correcta":true},{"id":"D","texto":"sdfadfw","correcta":false}]}]', '', 'A', '2016-09-04 08:30:37', 3, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE IF NOT EXISTS `modulo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `descripcion` text,
  `estado` varchar(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Supercategoría de los artículos\n';

--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'hola3', 'como', 'A'),
(2, 'sdf', 'sdfdf', 'A'),
(3, 'dfsd', 'sdfdddd', 'A');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opcion`
--

CREATE TABLE IF NOT EXISTS `opcion` (
  `id` int(11) NOT NULL,
  `coleccion` text,
  `respuestaCorrecta` varchar(1) DEFAULT NULL,
  `fechaRegistro` datetime DEFAULT NULL,
  `cuestionario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Opciones, aqui registro las preguntas en formato json';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parametros`
--

CREATE TABLE IF NOT EXISTS `parametros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `valor` varchar(255) DEFAULT NULL,
  `params` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temario`
--

CREATE TABLE IF NOT EXISTS `temario` (
  `id` int(11) NOT NULL,
  `nivel` varchar(80) DEFAULT NULL COMMENT '(B)asico\n(M)edio\n(A)vanzado',
  `ayudaPaginaWeb` tinyint(1) DEFAULT NULL,
  `ayudaVideos` tinyint(1) DEFAULT NULL,
  `ayudaPresentaciones` tinyint(1) DEFAULT NULL,
  `ayudaLibros` tinyint(1) DEFAULT NULL,
  `ayudaApuntesClase` tinyint(1) DEFAULT NULL,
  `ayudaOtros` tinyint(1) DEFAULT NULL,
  `ayudaCompas` tinyint(1) DEFAULT NULL,
  `ayudaProfesor` tinyint(1) DEFAULT NULL,
  `ayudaFamiliares` tinyint(1) DEFAULT NULL,
  `ayudaAmigos` tinyint(1) DEFAULT NULL,
  `dedicacionHoras` int(11) DEFAULT NULL,
  `dedicacionDias` int(11) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `temario`
--

INSERT INTO `temario` (`id`, `nivel`, `ayudaPaginaWeb`, `ayudaVideos`, `ayudaPresentaciones`, `ayudaLibros`, `ayudaApuntesClase`, `ayudaOtros`, `ayudaCompas`, `ayudaProfesor`, `ayudaFamiliares`, `ayudaAmigos`, `dedicacionHoras`, `dedicacionDias`, `usuario_id`) VALUES
(2, 'A', 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `apellido` varchar(80) NOT NULL,
  `identificacion` varchar(80) DEFAULT NULL,
  `usuario` varchar(80) NOT NULL,
  `email` varchar(80) NOT NULL,
  `clave` varchar(80) DEFAULT NULL,
  `perfil` varchar(1) DEFAULT NULL COMMENT '(A)dministrador\nEstudiante (C)ontrol\nEstudiante (E)xperimental\n',
  `fechaRegistro` datetime DEFAULT NULL,
  `estado` varchar(1) DEFAULT NULL COMMENT '(A)ctivo\n(I)nactivo\n(S)in Contraseña\n',
  `params` text,
  `ultimoAcceso` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellido`, `identificacion`, `usuario`, `email`, `clave`, `perfil`, `fechaRegistro`, `estado`, `params`, `ultimoAcceso`) VALUES
(1, 'ADMIN', 'SUPERUSUARIO', '002', 'admin@math.com', 'admin@math.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'A', '2016-08-14 00:00:00', 'A', NULL, '2016-09-04 13:48:39'),
(2, 'CARLOS ', 'ALDANA', '11111', 'carlos@math.com', 'carlos@math.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'C', '2016-08-17 00:00:00', 'A', NULL, '2016-09-04 13:48:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_cuestionario`
--

CREATE TABLE IF NOT EXISTS `usuario_cuestionario` (
  `id` int(11) NOT NULL,
  `fechaRegistro` varchar(80) DEFAULT NULL,
  `fechaInicio` varchar(80) DEFAULT NULL,
  `fechaFinal` varchar(80) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `cuestionario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_temario`
--

CREATE TABLE IF NOT EXISTS `usuario_temario` (
  `id` int(11) NOT NULL,
  `fechaRegistro` varchar(80) DEFAULT NULL,
  `calificacion` varchar(80) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `articulo_id` int(11) NOT NULL,
  `fechaInicio` varchar(80) DEFAULT NULL,
  `fechaFinal` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `nombre_UNIQUE` (`nombre`), ADD KEY `fk_articulo_modulo1_idx` (`modulo_id`), ADD KEY `fk_articulo_articulo1_idx` (`articulo_id`);

--
-- Indices de la tabla `cuestionario`
--
ALTER TABLE `cuestionario`
  ADD PRIMARY KEY (`id`), ADD KEY `fk_cuestionario_articulo1_idx` (`articulo_id`);

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `nombre_UNIQUE` (`nombre`);

--
-- Indices de la tabla `opcion`
--
ALTER TABLE `opcion`
  ADD PRIMARY KEY (`id`), ADD KEY `fk_opcion_cuestionario_idx` (`cuestionario_id`);

--
-- Indices de la tabla `parametros`
--
ALTER TABLE `parametros`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `nombre_UNIQUE` (`nombre`);

--
-- Indices de la tabla `temario`
--
ALTER TABLE `temario`
  ADD PRIMARY KEY (`id`), ADD KEY `fk_temario_usuario1_idx` (`usuario_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `usuario_UNIQUE` (`usuario`), ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- Indices de la tabla `usuario_cuestionario`
--
ALTER TABLE `usuario_cuestionario`
  ADD PRIMARY KEY (`id`), ADD KEY `fk_usuario_cuestionario_usuario1_idx` (`usuario_id`), ADD KEY `fk_usuario_cuestionario_cuestionario1_idx` (`cuestionario_id`);

--
-- Indices de la tabla `usuario_temario`
--
ALTER TABLE `usuario_temario`
  ADD PRIMARY KEY (`id`), ADD KEY `fk_usuario_temario_usuario1_idx` (`usuario_id`), ADD KEY `fk_usuario_temario_articulo1_idx` (`articulo_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `articulo`
--
ALTER TABLE `articulo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT de la tabla `cuestionario`
--
ALTER TABLE `cuestionario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `opcion`
--
ALTER TABLE `opcion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `parametros`
--
ALTER TABLE `parametros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `temario`
--
ALTER TABLE `temario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `usuario_cuestionario`
--
ALTER TABLE `usuario_cuestionario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `usuario_temario`
--
ALTER TABLE `usuario_temario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `articulo`
--
ALTER TABLE `articulo`
ADD CONSTRAINT `fk_articulo_articulo1` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_articulo_modulo1` FOREIGN KEY (`modulo_id`) REFERENCES `modulo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `cuestionario`
--
ALTER TABLE `cuestionario`
ADD CONSTRAINT `fk_cuestionario_articulo1` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `opcion`
--
ALTER TABLE `opcion`
ADD CONSTRAINT `fk_opcion_cuestionario` FOREIGN KEY (`cuestionario_id`) REFERENCES `cuestionario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `temario`
--
ALTER TABLE `temario`
ADD CONSTRAINT `fk_temario_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_cuestionario`
--
ALTER TABLE `usuario_cuestionario`
ADD CONSTRAINT `fk_usuario_cuestionario_cuestionario1` FOREIGN KEY (`cuestionario_id`) REFERENCES `cuestionario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_usuario_cuestionario_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario_temario`
--
ALTER TABLE `usuario_temario`
ADD CONSTRAINT `fk_usuario_temario_articulo1` FOREIGN KEY (`articulo_id`) REFERENCES `articulo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_usuario_temario_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
