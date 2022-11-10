let modalKey = 0

let quantshows = 1

let cart = []

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.showWindowArea').style.opacity = 0
    seleciona('.showWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.showWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.showWindowArea').style.opacity = 0
    setTimeout(() => seleciona('.showWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.showInfo--cancelButton, .showInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasshows = (showItem, item, index) => {

	showItem.setAttribute('data-key', index)
    showItem.querySelector('.show-item--img img').src = item.img
    showItem.querySelector('.show-item--price').innerHTML = formatoReal(item.price[2])
    showItem.querySelector('.show-item--name').innerHTML = item.name
    showItem.querySelector('.show-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.showBig img').src = item.img
    seleciona('.showInfo h1').innerHTML = item.name
    seleciona('.showInfo--desc').innerHTML = item.description
    seleciona('.showInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}


const pegarKey = (e) => {

    let key = e.target.closest('.show-item').getAttribute('data-key')
    console.log('show clicada ' + key)
    console.log(showJson[key])

    quantshows = 1

    modalKey = key

    return key
}

const preencherTamanhos = (key) => {

    seleciona('.showInfo--size.selected').classList.remove('selected')


    selecionaTodos('.showInfo--size').forEach((size, sizeIndex) => {

        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = showJson[key].types[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {

    selecionaTodos('.showInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {

            seleciona('.showInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')
            seleciona('.showInfo--actualPrice').innerHTML = formatoReal(showJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {

    seleciona('.showInfo--qtmais').addEventListener('click', () => {
        quantshows++
        seleciona('.showInfo--qt').innerHTML = quantshows
    })

    seleciona('.showInfo--qtmenos').addEventListener('click', () => {
        if(quantshows > 1) {
            quantshows--
            seleciona('.showInfo--qt').innerHTML = quantshows	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.showInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    	console.log("show " + modalKey)
	    let size = seleciona('.showInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
    	console.log("Quant. " + quantshows)
        let price = seleciona('.showInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')

	    let identificador = showJson[modalKey].id+'t'+size

        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {

            cart[key].qt += quantshows
        } else {

            let show = {
                identificador,
                id: showJson[modalKey].id,
                size,
                qt: quantshows,
                price: parseFloat(price)
            }
            cart.push(show)
            console.log(show)
            console.log('Sub total R$ ' + (show.qt * show.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex'
    }

    
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' 
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    
	seleciona('.menu-openner span').innerHTML = cart.length
	
	
	if(cart.length > 0) {

		
		seleciona('aside').classList.add('show')

		
		seleciona('.cart').innerHTML = ''

        
		let subtotal = 0
		let desconto = 0
		let total    = 0

        
		for(let i in cart) {
			
			let showItem = showJson.find( (item) => item.id == cart[i].id )
			console.log(showItem)

            
        	subtotal += cart[i].price * cart[i].qt
            

			
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let showSizeName = cart[i].size

			let showName = `${showItem.name} (${showSizeName})`

			
			cartItem.querySelector('img').src = showItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = showName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				
				cart[i].qt++
				
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					
					cart[i].qt--
				} else {
					
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		}

		desconto = subtotal * 0
		total = subtotal - desconto

		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        alert('Parabéns! Seu ingresso foi adquirido com sucesso, tenha um bom show!')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

showJson.map((item, index ) => {

    let showItem = document.querySelector('.models .show-item').cloneNode(true)

    seleciona('.show-area').append(showItem)

    preencheDadosDasshows(showItem, item, index)
    
    showItem.querySelector('.show-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na show')

        let chave = pegarKey(e)

        abrirModal()

        preencheDadosModal(item)

        preencherTamanhos(chave)

		seleciona('.showInfo--qt').innerHTML = quantshows

        escolherTamanhoPreco(chave)

    })

    botoesFechar()

})

mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
