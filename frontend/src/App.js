import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import BTable from 'react-bootstrap/Table';
import styled from 'styled-components';
import ImageLoader from 'react-load-image';
import LoadingComponent  from './component/LoadingComponent';
import { Button, Modal, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useTable } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';

const axiosConfig = {
    baseURL: 'http://localhost:8000/'
}

const api = axios.create(axiosConfig);

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

`

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <BTable style={{width: '80%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}} striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps({style: {width: column.width}})}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
  )
};

function App() {
	let render;
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [fileState, setFileState] = useState({});
	const [data, setData] = useState([]);

	const defaultValue = {
		'fotoBarang' : '',
		'namaBarang' : '',
		'hargaBeli' : '',
		'hargaJual' : '',
		'stok' : '',
		'action': ''
	} 

	const [ formField, setFormField ] = useState(defaultValue);

	const fileref = useRef();

	const loadData = () => {
		setLoading(true);
		api.get('produk', {params : {'search': 'test'}}).then(function (response) {
			// handle success
			setData(response.data);
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.then(function () {
			// always executed
			setTimeout(() => {
				setLoading(false);
			}, 500);
		});
	};

	const handleFormAdd = () => {
		setTitle("Form Produk (Add)");
		setFormField({...formField, action: 'create'});
		setShowForm(true);
	};

	const handleFormEdit = (id) => {
		setTitle("Form Produk (Edit)");
		api.get(`produk/${id}`).then(function (response) {
			// handle success
			setFormField({
				'id' : id,
				'fotoBarang' : response.data.foto_barang,
				'namaBarang' : response.data.nama_barang,
				'hargaBeli' : response.data.harga_beli,
				'hargaJual' : response.data.harga_jual,
				'stok' : response.data.stok,
				'action': 'update'
			});
			setShowForm(true);
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.then(function () {
			// always executed
			setLoading(false);
		});
	};
	
	const handleFormClose = () => {
		setShowForm(false);
		
		setTimeout(() => {
			setFormField(defaultValue);
		}, 500);

	};

	const handleSubmit = async (event) => {

		let url;

		if(formField.action === 'create'){
			url = 'produk_add';
		}
		else if(formField.action === 'update'){
			url = `produk/update/${formField.id}`;
		}

		let formData = new FormData();
		formData.append("file", fileState);

		let input = {...formField, file : formData};
		
		await api.post(url, input, {headers: {
			'Content-Type': 'multipart/form-data'
		}}).then(function (response) {
			// handle success
			setShowForm(false);
			setFormField(defaultValue);
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.then(function () {
			// always executed
			loadData();
		});
	};

	const handleDelete = async (id) => {

		if(window.confirm("Are you sure ?")){
			await api.post(`produk/delete/${id}`, {},  {headers: {
				'Content-Type': 'text/plain;charset=utf-8',
			}}).then(function (response) {
				setFormField(defaultValue);
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				loadData();
			});
		};
	};
	
	const handleBrowse = (e) => {
        fileref.current.click();
    }

	const handleChange = (e, type) => {
		switch(type){
			case 'namaBarang':
				setFormField({...formField, namaBarang: e.target.value});
				break;
			case 'hargaBeli':
				setFormField({...formField, hargaBeli: e.target.value});
				break;
			case 'hargaJual':
				setFormField({...formField, hargaJual: e.target.value});
				break;
			case 'stok':
				setFormField({...formField, stok: e.target.value});
				break;
			default:
				setFormField({...formField});
				break;
		}
	};

	const columns = React.useMemo(
		() => [
			{
				Header: "No",
				accessor: "",
				Cell: (row) => {
					return parseInt(row.row.id) + 1;
				},
				disableSortBy: true,
				disableFilters: true,
				width: '2%'
			},
			{
				Header: 'Foto Barang',
				accessor: 'foto_barang',
				Cell: ({value, row}) => {
					return (
						<ImageLoader
							src={`../images/foto_barang/${value}`}
						>
							<img alt="foto barang" style={{width: '150px'}}/>
							<div>Not Found!</div>
						</ImageLoader>
					)
				},
				width: '10%'
				
			},
			{
				Header: 'Nama Barang',
				accessor: 'nama_barang',
				width: '10%'
			},
			{
				Header: 'Harga Beli',
				accessor: 'harga_beli',
				width: '10%'
			},
			{
				Header: 'Harga Jual',
				accessor: 'harga_jual',
				width: '10%'
			},
			{
				Header: 'Stok',
				accessor: 'stok',
				width: '10%'
			},
			{ Header: '', id:'colAction', accessor: 'id',width: '7%',
				Cell: ({row, column, value}) => 
					<div>
						<Button variant="success" onClick={() => { handleFormEdit(value) }}>Edit</Button>
						&nbsp;
						<Button variant="danger" onClick={() => { handleDelete(value) }}>Del</Button>
					</div>
			},
		],[]
	)


	useEffect(() => {
		api.get(`image_path`).then(function (response) {
		})
		.catch(function (error) {
			console.log(error);
		});
		loadData();
	}, []);

  	// const data = React.useMemo(() => makeData(20), []);

	if(loading){	
		render = <LoadingComponent/>
	} else {
		render = <Table columns={columns}  data={data}/>
	}

	return (
		<Styles>
			
			<Button style={{float: 'right'}} variant="primary" onClick={handleFormAdd}>Add</Button>
			
			<br /><br />
			
			<h2 style={{textAlign:"center"}}>Daftar Produk</h2>
			{ render }

			<Form onSubmit={handleSubmit} noValidate>
				<Modal show={showForm} onHide={handleFormClose}>
					<Modal.Header closeButton>
						<Modal.Title>{title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<label>Foto Barang : </label>
							<InputGroup>
								<FormControl ref={fileref} type="file" onChange={(e) => { 
									setFileState(e.currentTarget.files[0]);
								}} accept="file/*" className="d-none"/>
								<FormControl onClick={handleBrowse} value={fileState.name || ''} readOnly/>
								<Button onClick={handleBrowse}>Browse</Button>
							</InputGroup>
						</Form.Group>
						<br />
						<Form.Group controlId="namaBarang">
							<Form.Label>Nama Barang</Form.Label>
							<Form.Control type="text" placeholder="Nama Barang" onChange={(e) => {handleChange(e, 'namaBarang')}} value={formField.namaBarang} />
						</Form.Group>
						<br />
						<Form.Group controlId="hargaBeli">
							<Form.Label>Harga Beli</Form.Label>
							<Form.Control type="number" placeholder="Harga Beli" onChange={(e) => {handleChange(e, 'hargaBeli')}} value={formField.hargaBeli} />
						</Form.Group>
						<br />
						<Form.Group controlId="hargaJual">
							<Form.Label>Harga Jual</Form.Label>
							<Form.Control type="number" placeholder="Harga Jual" onChange={(e) => {handleChange(e, 'hargaJual')}} value={formField.hargaJual} />
						</Form.Group>
						<br />
						<Form.Group controlId="stok">
							<Form.Label>Stok</Form.Label>
							<Form.Control type="number" placeholder="Stok" onChange={(e) => {handleChange(e, 'stok')}} value={formField.stok} />
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleFormClose}>
						Close
						</Button>
						<Button variant="primary" type="submit" onClick={handleSubmit}> 
						Save
						</Button>
					</Modal.Footer>
				</Modal>
			</Form>
		</Styles>
	)
};

export default App;
