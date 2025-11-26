--
-- PostgreSQL database dump
--

\restrict 6niKaldjwsZs8llZjAeEkiHqmEOsWylTNDvfBQiAaEwZpfS6IFIYeQZT6C0LA9Y

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.NgayCapNhat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auditlog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditlog (
    auditid character varying(20) NOT NULL,
    mauser character varying(20),
    thaotac character varying(100) NOT NULL,
    mahoso character varying(20),
    thoigian timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    chitiet text,
    ipnguoidung character varying(50)
);


ALTER TABLE public.auditlog OWNER TO postgres;

--
-- Name: TABLE auditlog; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.auditlog IS 'Nh???t k?? ho???t ?????ng h??? th???ng';


--
-- Name: COLUMN auditlog.thaotac; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.auditlog.thaotac IS 'CREATE, UPDATE, DELETE, LOGIN, APPROVE, v.v.';


--
-- Name: baocao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.baocao (
    mabaocao character varying(20) NOT NULL,
    mahoso character varying(20) NOT NULL,
    ngaynop date,
    noidung text,
    filebaocao character varying(500),
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.baocao OWNER TO postgres;

--
-- Name: TABLE baocao; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.baocao IS 'B??o c??o sau khi ??i n?????c ngo??i';


--
-- Name: chibo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chibo (
    machibo character varying(20) NOT NULL,
    tenchibo character varying(200) NOT NULL,
    emaillienhe character varying(100),
    madonvi character varying(20),
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.chibo OWNER TO postgres;

--
-- Name: TABLE chibo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.chibo IS 'Danh s??ch c??c chi b??? ?????ng';


--
-- Name: dangvien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dangvien (
    madangvien character varying(20) NOT NULL,
    mavienchuc character varying(20) NOT NULL,
    machibo character varying(20),
    ngayvaodang date,
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dangvien OWNER TO postgres;

--
-- Name: TABLE dangvien; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.dangvien IS 'Th??ng tin ?????ng vi??n';


--
-- Name: donvi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donvi (
    madonvi character varying(20) NOT NULL,
    tendonvi character varying(200) NOT NULL,
    loaidonvi character varying(50),
    diachi character varying(255),
    dienthoai character varying(20),
    email character varying(100),
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.donvi OWNER TO postgres;

--
-- Name: TABLE donvi; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.donvi IS 'Danh s??ch c??c ????n v???/ph??ng ban trong tr?????ng';


--
-- Name: COLUMN donvi.loaidonvi; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.donvi.loaidonvi IS 'Khoa, Ph??ng, Ban, Trung t??m, v.v.';


--
-- Name: hoso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hoso (
    mahoso character varying(20) NOT NULL,
    mavienchuc character varying(20) NOT NULL,
    loaihoso character varying(50),
    ngaynop date,
    ngaydukiendi date,
    ngayvedukien date,
    mucdich character varying(255),
    nuocden character varying(100),
    thoigianluutru character varying(50),
    kinhphi character varying(100),
    trangthaihoso character varying(50) DEFAULT 'Ch??? duy???t'::character varying,
    ghichu text,
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hoso OWNER TO postgres;

--
-- Name: TABLE hoso; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.hoso IS 'H??? s?? xin ??i n?????c ngo??i c???a vi??n ch???c';


--
-- Name: COLUMN hoso.trangthaihoso; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.hoso.trangthaihoso IS 'Ch??? duy???t, ???? duy???t, T??? ch???i, Ho??n th??nh';


--
-- Name: nguoidung; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nguoidung (
    mauser character varying(20) NOT NULL,
    tendangnhap character varying(50) NOT NULL,
    matkhauhash character varying(255) NOT NULL,
    hoten character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    sodienthoai character varying(20),
    madonvi character varying(20),
    trangthai character varying(20) DEFAULT 'active'::character varying,
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    landangnhapcuoi timestamp without time zone,
    CONSTRAINT nguoidung_trangthai_check CHECK (((trangthai)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'locked'::character varying])::text[])))
);


ALTER TABLE public.nguoidung OWNER TO postgres;

--
-- Name: TABLE nguoidung; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.nguoidung IS 'T??i kho???n ng?????i d??ng h??? th???ng';


--
-- Name: COLUMN nguoidung.matkhauhash; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.nguoidung.matkhauhash IS 'M???t kh???u ???? hash b???ng bcrypt';


--
-- Name: phanquyenchucnang; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phanquyenchucnang (
    id character varying(20) NOT NULL,
    mavaitro character varying(20) NOT NULL,
    chucnang character varying(100) NOT NULL,
    chophep boolean DEFAULT true,
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.phanquyenchucnang OWNER TO postgres;

--
-- Name: TABLE phanquyenchucnang; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.phanquyenchucnang IS 'Ph??n quy???n ch???c n??ng cho t???ng vai tr??';


--
-- Name: COLUMN phanquyenchucnang.chucnang; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.phanquyenchucnang.chucnang IS 'T??n ch???c n??ng: CREATE_HOSO, APPROVE_HOSO, VIEW_REPORT, v.v.';


--
-- Name: pheduyet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pheduyet (
    mapheduyet character varying(20) NOT NULL,
    mahoso character varying(20) NOT NULL,
    cappheduyet character varying(50),
    manguoiduyet character varying(20),
    ketqua character varying(20),
    ngaypheduyet timestamp without time zone,
    ghichu text,
    chukyso character varying(500),
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pheduyet_ketqua_check CHECK (((ketqua)::text = ANY ((ARRAY['Ch??? duy???t'::character varying, 'Ch???p thu???n'::character varying, 'T??? ch???i'::character varying])::text[])))
);


ALTER TABLE public.pheduyet OWNER TO postgres;

--
-- Name: TABLE pheduyet; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.pheduyet IS 'Quy tr??nh ph?? duy???t h??? s??';


--
-- Name: COLUMN pheduyet.cappheduyet; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.pheduyet.cappheduyet IS 'C???p 1 (Tr?????ng khoa), C???p 2 (BGH), v.v.';


--
-- Name: tailieu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tailieu (
    matailieu character varying(20) NOT NULL,
    mahoso character varying(20) NOT NULL,
    loaitailieu character varying(50),
    tenfile character varying(255) NOT NULL,
    duongdanfile character varying(500) NOT NULL,
    ngayupload timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    kichthuoc integer
);


ALTER TABLE public.tailieu OWNER TO postgres;

--
-- Name: TABLE tailieu; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tailieu IS 'T??i li???u ????nh k??m h??? s??';


--
-- Name: COLUMN tailieu.kichthuoc; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tailieu.kichthuoc IS 'K??ch th?????c file (bytes)';


--
-- Name: userrole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userrole (
    id character varying(20) NOT NULL,
    mauser character varying(20) NOT NULL,
    mavaitro character varying(20) NOT NULL,
    ngaygan timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.userrole OWNER TO postgres;

--
-- Name: TABLE userrole; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.userrole IS 'G??n vai tr?? cho ng?????i d??ng';


--
-- Name: vaitro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaitro (
    mavaitro character varying(20) NOT NULL,
    tenvaitro character varying(50) NOT NULL,
    mota text,
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vaitro OWNER TO postgres;

--
-- Name: TABLE vaitro; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.vaitro IS 'Vai tr?? ng?????i d??ng (Admin, Tr?????ng ph??ng, Vi??n ch???c, v.v.)';


--
-- Name: vienchuc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vienchuc (
    mavienchuc character varying(20) NOT NULL,
    hoten character varying(100) NOT NULL,
    ngaysinh date,
    gioitinh character varying(10),
    madonvi character varying(20),
    chucdanh character varying(100),
    email character varying(100),
    sodienthoai character varying(20),
    ladangvien boolean DEFAULT false,
    ngaytao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ngaycapnhat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vienchuc_gioitinh_check CHECK (((gioitinh)::text = ANY ((ARRAY['Nam'::character varying, 'N???'::character varying, 'Kh??c'::character varying])::text[])))
);


ALTER TABLE public.vienchuc OWNER TO postgres;

--
-- Name: TABLE vienchuc; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.vienchuc IS 'Th??ng tin vi??n ch???c, gi???ng vi??n';


--
-- Name: COLUMN vienchuc.ladangvien; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.vienchuc.ladangvien IS 'True n???u l?? ?????ng vi??n';


--
-- Data for Name: auditlog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditlog (auditid, mauser, thaotac, mahoso, thoigian, chitiet, ipnguoidung) FROM stdin;
\.


--
-- Data for Name: baocao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baocao (mabaocao, mahoso, ngaynop, noidung, filebaocao, ngaytao) FROM stdin;
\.


--
-- Data for Name: chibo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chibo (machibo, tenchibo, emaillienhe, madonvi, ngaytao) FROM stdin;
\.


--
-- Data for Name: dangvien; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dangvien (madangvien, mavienchuc, machibo, ngayvaodang, ngaytao) FROM stdin;
\.


--
-- Data for Name: donvi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.donvi (madonvi, tendonvi, loaidonvi, diachi, dienthoai, email, ngaytao, ngaycapnhat) FROM stdin;
DV001	Ph??ng T??? ch???c - H??nh ch??nh	Ph??ng	\N	\N	tchc@tvu.edu.vn	2025-11-23 03:49:40.564928	2025-11-23 03:49:40.564928
DV002	Khoa C??ng ngh??? Th??ng tin	Khoa	\N	\N	fit@tvu.edu.vn	2025-11-23 03:49:40.564928	2025-11-23 03:49:40.564928
DV003	Khoa Kinh t???	Khoa	\N	\N	economics@tvu.edu.vn	2025-11-23 03:49:40.564928	2025-11-23 03:49:40.564928
DV004	Ph??ng Khoa h???c & C??ng ngh???	Ph??ng	\N	\N	khcn@tvu.edu.vn	2025-11-23 03:49:40.564928	2025-11-23 03:49:40.564928
\.


--
-- Data for Name: hoso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hoso (mahoso, mavienchuc, loaihoso, ngaynop, ngaydukiendi, ngayvedukien, mucdich, nuocden, thoigianluutru, kinhphi, trangthaihoso, ghichu, ngaytao, ngaycapnhat) FROM stdin;
\.


--
-- Data for Name: nguoidung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nguoidung (mauser, tendangnhap, matkhauhash, hoten, email, sodienthoai, madonvi, trangthai, ngaytao, landangnhapcuoi) FROM stdin;
USER001	admin	$2b$10$rT8EXQY4z6XqK3h3J9Q1HuYGK8YXZ0NZc1xmN5gLlU6K8YN8XZ0Ne	Qu???n tr??? vi??n	admin@tvu.edu.vn	\N	DV001	active	2025-11-23 03:49:40.568418	\N
\.


--
-- Data for Name: phanquyenchucnang; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phanquyenchucnang (id, mavaitro, chucnang, chophep, ngaytao) FROM stdin;
PQ001	VT001	CREATE_HOSO	t	2025-11-23 03:49:40.574534
PQ002	VT001	APPROVE_HOSO	t	2025-11-23 03:49:40.574534
PQ003	VT001	DELETE_HOSO	t	2025-11-23 03:49:40.574534
PQ004	VT001	VIEW_REPORT	t	2025-11-23 03:49:40.574534
PQ005	VT001	MANAGE_USER	t	2025-11-23 03:49:40.574534
PQ006	VT004	CREATE_HOSO	t	2025-11-23 03:49:40.574534
PQ007	VT004	VIEW_OWN_HOSO	t	2025-11-23 03:49:40.574534
\.


--
-- Data for Name: pheduyet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pheduyet (mapheduyet, mahoso, cappheduyet, manguoiduyet, ketqua, ngaypheduyet, ghichu, chukyso, ngaytao) FROM stdin;
\.


--
-- Data for Name: tailieu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tailieu (matailieu, mahoso, loaitailieu, tenfile, duongdanfile, ngayupload, kichthuoc) FROM stdin;
\.


--
-- Data for Name: userrole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userrole (id, mauser, mavaitro, ngaygan) FROM stdin;
UR001	USER001	VT001	2025-11-23 03:49:40.572326
\.


--
-- Data for Name: vaitro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vaitro (mavaitro, tenvaitro, mota, ngaytao) FROM stdin;
VT001	Admin	Qu???n tr??? vi??n h??? th???ng	2025-11-23 03:49:40.566705
VT002	Tr?????ng ph??ng TCHC	Ph?? duy???t h??? s?? c???p 1	2025-11-23 03:49:40.566705
VT003	Ban Gi??m hi???u	Ph?? duy???t h??? s?? c???p cao nh???t	2025-11-23 03:49:40.566705
VT004	Vi??n ch???c	N???p v?? theo d??i h??? s??	2025-11-23 03:49:40.566705
VT005	Tr?????ng khoa	X??c nh???n h??? s?? ????n v???	2025-11-23 03:49:40.566705
\.


--
-- Data for Name: vienchuc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vienchuc (mavienchuc, hoten, ngaysinh, gioitinh, madonvi, chucdanh, email, sodienthoai, ladangvien, ngaytao, ngaycapnhat) FROM stdin;
\.


--
-- Name: auditlog auditlog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditlog
    ADD CONSTRAINT auditlog_pkey PRIMARY KEY (auditid);


--
-- Name: baocao baocao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baocao
    ADD CONSTRAINT baocao_pkey PRIMARY KEY (mabaocao);


--
-- Name: chibo chibo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chibo
    ADD CONSTRAINT chibo_pkey PRIMARY KEY (machibo);


--
-- Name: dangvien dangvien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dangvien
    ADD CONSTRAINT dangvien_pkey PRIMARY KEY (madangvien);


--
-- Name: donvi donvi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donvi
    ADD CONSTRAINT donvi_pkey PRIMARY KEY (madonvi);


--
-- Name: hoso hoso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoso
    ADD CONSTRAINT hoso_pkey PRIMARY KEY (mahoso);


--
-- Name: nguoidung nguoidung_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_email_key UNIQUE (email);


--
-- Name: nguoidung nguoidung_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_pkey PRIMARY KEY (mauser);


--
-- Name: nguoidung nguoidung_tendangnhap_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_tendangnhap_key UNIQUE (tendangnhap);


--
-- Name: phanquyenchucnang phanquyenchucnang_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phanquyenchucnang
    ADD CONSTRAINT phanquyenchucnang_pkey PRIMARY KEY (id);


--
-- Name: pheduyet pheduyet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pheduyet
    ADD CONSTRAINT pheduyet_pkey PRIMARY KEY (mapheduyet);


--
-- Name: tailieu tailieu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tailieu
    ADD CONSTRAINT tailieu_pkey PRIMARY KEY (matailieu);


--
-- Name: userrole userrole_mauser_mavaitro_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_mauser_mavaitro_key UNIQUE (mauser, mavaitro);


--
-- Name: userrole userrole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_pkey PRIMARY KEY (id);


--
-- Name: vaitro vaitro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaitro
    ADD CONSTRAINT vaitro_pkey PRIMARY KEY (mavaitro);


--
-- Name: vienchuc vienchuc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vienchuc
    ADD CONSTRAINT vienchuc_pkey PRIMARY KEY (mavienchuc);


--
-- Name: idx_auditlog_thoigian; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditlog_thoigian ON public.auditlog USING btree (thoigian);


--
-- Name: idx_auditlog_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditlog_user ON public.auditlog USING btree (mauser);


--
-- Name: idx_hoso_ngaynop; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hoso_ngaynop ON public.hoso USING btree (ngaynop);


--
-- Name: idx_hoso_trangthai; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hoso_trangthai ON public.hoso USING btree (trangthaihoso);


--
-- Name: idx_hoso_vienchuc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hoso_vienchuc ON public.hoso USING btree (mavienchuc);


--
-- Name: idx_nguoidung_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nguoidung_email ON public.nguoidung USING btree (email);


--
-- Name: idx_nguoidung_tendangnhap; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nguoidung_tendangnhap ON public.nguoidung USING btree (tendangnhap);


--
-- Name: idx_pheduyet_hoso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pheduyet_hoso ON public.pheduyet USING btree (mahoso);


--
-- Name: idx_pheduyet_nguoiduyet; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pheduyet_nguoiduyet ON public.pheduyet USING btree (manguoiduyet);


--
-- Name: idx_tailieu_hoso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tailieu_hoso ON public.tailieu USING btree (mahoso);


--
-- Name: idx_vienchuc_donvi; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vienchuc_donvi ON public.vienchuc USING btree (madonvi);


--
-- Name: idx_vienchuc_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vienchuc_email ON public.vienchuc USING btree (email);


--
-- Name: donvi trg_donvi_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_donvi_update BEFORE UPDATE ON public.donvi FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: hoso trg_hoso_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_hoso_update BEFORE UPDATE ON public.hoso FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: vienchuc trg_vienchuc_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_vienchuc_update BEFORE UPDATE ON public.vienchuc FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: auditlog auditlog_mahoso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditlog
    ADD CONSTRAINT auditlog_mahoso_fkey FOREIGN KEY (mahoso) REFERENCES public.hoso(mahoso) ON DELETE SET NULL;


--
-- Name: auditlog auditlog_mauser_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditlog
    ADD CONSTRAINT auditlog_mauser_fkey FOREIGN KEY (mauser) REFERENCES public.nguoidung(mauser) ON DELETE SET NULL;


--
-- Name: baocao baocao_mahoso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baocao
    ADD CONSTRAINT baocao_mahoso_fkey FOREIGN KEY (mahoso) REFERENCES public.hoso(mahoso) ON DELETE CASCADE;


--
-- Name: chibo chibo_madonvi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chibo
    ADD CONSTRAINT chibo_madonvi_fkey FOREIGN KEY (madonvi) REFERENCES public.donvi(madonvi) ON DELETE SET NULL;


--
-- Name: dangvien dangvien_machibo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dangvien
    ADD CONSTRAINT dangvien_machibo_fkey FOREIGN KEY (machibo) REFERENCES public.chibo(machibo) ON DELETE SET NULL;


--
-- Name: dangvien dangvien_mavienchuc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dangvien
    ADD CONSTRAINT dangvien_mavienchuc_fkey FOREIGN KEY (mavienchuc) REFERENCES public.vienchuc(mavienchuc) ON DELETE CASCADE;


--
-- Name: hoso hoso_mavienchuc_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoso
    ADD CONSTRAINT hoso_mavienchuc_fkey FOREIGN KEY (mavienchuc) REFERENCES public.vienchuc(mavienchuc) ON DELETE CASCADE;


--
-- Name: nguoidung nguoidung_madonvi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nguoidung
    ADD CONSTRAINT nguoidung_madonvi_fkey FOREIGN KEY (madonvi) REFERENCES public.donvi(madonvi) ON DELETE SET NULL;


--
-- Name: phanquyenchucnang phanquyenchucnang_mavaitro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phanquyenchucnang
    ADD CONSTRAINT phanquyenchucnang_mavaitro_fkey FOREIGN KEY (mavaitro) REFERENCES public.vaitro(mavaitro) ON DELETE CASCADE;


--
-- Name: pheduyet pheduyet_mahoso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pheduyet
    ADD CONSTRAINT pheduyet_mahoso_fkey FOREIGN KEY (mahoso) REFERENCES public.hoso(mahoso) ON DELETE CASCADE;


--
-- Name: pheduyet pheduyet_manguoiduyet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pheduyet
    ADD CONSTRAINT pheduyet_manguoiduyet_fkey FOREIGN KEY (manguoiduyet) REFERENCES public.nguoidung(mauser) ON DELETE SET NULL;


--
-- Name: tailieu tailieu_mahoso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tailieu
    ADD CONSTRAINT tailieu_mahoso_fkey FOREIGN KEY (mahoso) REFERENCES public.hoso(mahoso) ON DELETE CASCADE;


--
-- Name: userrole userrole_mauser_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_mauser_fkey FOREIGN KEY (mauser) REFERENCES public.nguoidung(mauser) ON DELETE CASCADE;


--
-- Name: userrole userrole_mavaitro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_mavaitro_fkey FOREIGN KEY (mavaitro) REFERENCES public.vaitro(mavaitro) ON DELETE CASCADE;


--
-- Name: vienchuc vienchuc_madonvi_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vienchuc
    ADD CONSTRAINT vienchuc_madonvi_fkey FOREIGN KEY (madonvi) REFERENCES public.donvi(madonvi) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 6niKaldjwsZs8llZjAeEkiHqmEOsWylTNDvfBQiAaEwZpfS6IFIYeQZT6C0LA9Y

