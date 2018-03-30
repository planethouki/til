Sub pdf()
	Const pathFrom = "<path\>"
	Const pathTo = "<path\>"
	buf = Dir(pathFrom & Åg*.docxÅh)
	Do While buf <> ""
		Dim book As Document
		Set book = Documents.Open(pathFrom & buf)
		'ExportAsFixedFormat(OutputFileName As String, ExportFormat As WdExportFormat, [OpenAfterExport As Boolean = False], [OptimizeFor As WdExportOptimizeFor = wdExportOptimizeForPrint], [Range As WdExportRange = wdExportAllDocument], [From As Long = 1], [To As Long = 1], [Item As WdExportItem = wdExportDocumentContent], [IncludeDocProps As Boolean = False], [KeepIRM As Boolean = True], [CreateBookmarks As WdExportCreateBookmarks = wdExportCreateNoBookmarks], [DocStructureTags As Boolean = True], [BitmapMissingFonts As Boolean = True], [UseISO19005_1 As Boolean = False], [FixedFormatExtClassPtr])
		book.ExportAsFixedFormat _
		ExportFormat:=wdExportFormatPDF, _
		OutputFileName:=pathTo & Replace(book.Name, Åg.docxÅh, ÅgÅh)
		book.Close SaveChanges:=False
		buf = Dir()
	Loop
End Sub